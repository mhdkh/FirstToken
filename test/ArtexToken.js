var ArtexToken = artifacts.require("./ArtexToken.sol");

contract('ArtexToken', function(accounts) {
  var tokenInstance;
  it('initiates the contract with correct values', function(){
    return ArtexToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name){
      assert.equal(name,'Artex Token','has the correct name');
      return tokenInstance.symbol();
    }).then(function(symbol){
      assert.equal(symbol, 'ARTX', 'has the correct symbol');
      return tokenInstance.standard();
    }).then(function(standard){
      assert.equal(standard, 'Artex Token v1.0', 'has the correct standard');
    });

  })

  it('Allocates the initial supply upon deployment', function(){
    return ArtexToken.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.totalSupply();

    }).then(function(totalSupply){
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000');
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(adminBalance){
      assert.equal(adminBalance.toNumber(),1000000, 'it allocates the initial supply to admin');
    });
  });

    it('transfers token ownership', function(){
      return ArtexToken.deployed().then(function(instance){
        tokenInstance = instance;
        return tokenInstance.transfer.call(accounts[1],999999999999999);
      }).then(assert.fail).catch(function(error){
        assert(error.message.indexOf('revert') != -1, 'error message must contain revert');
        return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
      }).then(function(success){
          assert.equal(success, true,'it returns true');
        return tokenInstance.transfer(accounts[1], 250000,{from: accounts[0]});
      }).then(function(receipt){
        assert.equal(receipt.logs.length, 1, 'triggers one event');
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Transfer Event');
        assert.equal(receipt.logs[0].args._from,accounts[0], 'logs the account tokens transfered from');
        assert.equal(receipt.logs[0].args._to,accounts[1], 'logs the account tokens transfered to');
        assert.equal(receipt.logs[0].args._value,250000, 'logs the value transfered');
        return tokenInstance.balanceOf(accounts[1]);
      }).then(function(balance){
        assert.equal(balance.toNumber(),250000,'adds the amount to receiving account');
        return tokenInstance.balanceOf(accounts[0]);
      }).then(function(balance){
        assert.equal(balance.toNumber(), 750000, 'deducts the amount from sending account');
      });
    });

    it('approves tokens for delegated transfer', function(){
        return ArtexToken.deployed().then(function(instance){
          tokenInstance = instance;
          return tokenInstance.approve.call(accounts[1], 100);
          }).then(function(success){
            assert.equal(success, true, 'it returns true');
            return tokenInstance.approve(accounts[1],100, {from: accounts[0]});
          }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the Approval Event');
            assert.equal(receipt.logs[0].args._owner,accounts[0], 'logs the account tokens authorized by');
            assert.equal(receipt.logs[0].args._spender,accounts[1], 'logs the account tokens authorized to');
            assert.equal(receipt.logs[0].args._value,100, 'logs the value transfered');
            return tokenInstance.allowance(accounts[0], accounts[1]);
          }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated spender');

          });


      });

    it('handles delegated token transfers', function(){
        return ArtexToken.deployed().then(function(instance){
          tokenInstance = instance;
          fromAccount = accounts[2];
          toAccount = accounts[3];
          spendingAccount = accounts[4];
          //transfer some tokens to fromAccount
          return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
        }).then (function(receipt){
          // Approve spendingAccount to spend 10 tokens from fromAccount
            return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
        }).then(function(receipt){
          // Try transfering sth larger than sender's balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 101, {from: spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
          // Try transfering something larger than the allowed amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 11, {from: spendingAccount});
       }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
       }).then(function(success){
            assert.equal(success, true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Approval Event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account tokens transferred from');
            assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account tokens transferred to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the value transfered');
            return tokenInstance.balanceOf(fromAccount);
        }).then(balance => {
            assert.equal(balance.toNumber(), 90, 'deducts the amount from sending account');
            return tokenInstance.balanceOf(toAccount);
        }).then(balance => {
            assert.equal(balance.toNumber(), 10, 'adds the amount from sending account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 0, 'deducts the amount from allowance');
        });
    });


});

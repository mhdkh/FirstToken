pragma solidity ^0.5.0;
contract ArtexToken {

  string public name = "Artex Token";
  string public symbol = "ARTX";
  string public standard = "Artex Token v1.0";

  uint256 public totalSupply ;

  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  constructor (uint256 _initalSupply) public  {
    balanceOf[msg.sender] = _initalSupply;
    totalSupply = _initalSupply;

  }

  function transfer(address _to, uint256 _value) public returns(bool success){
    require(balanceOf[msg.sender] >= _value);
    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success){

    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom (address _from, address _to, uint256 _value) public returns (bool success){

    // require _from has enough tokens
    require(_value <= balanceOf[_from]);

    // require allowance is big enough
    require(_value <= allowance[_from][msg.sender]);

    // change the balance
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;

    // update the allowance
    allowance[_from][msg.sender] -= _value;

    // transfer Event
    emit Transfer(_from, _to, _value);

    // return a boolean
    return true;


  }

}

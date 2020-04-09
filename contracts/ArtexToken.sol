pragma solidity ^0.5.0;
contract ArtexToken {

  string public name = "Artex Token";
  string public symbol = "ARTX";
  string public standard = "Artex Token v1.0";

  uint256 public totalSupply ;

  mapping(address => uint256) public balanceOf;

  event Transfer(
    address indexed _from,
    address indexed _to,
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



}

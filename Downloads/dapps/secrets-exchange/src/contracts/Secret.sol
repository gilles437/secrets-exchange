pragma solidity 0.5.16;

import "./ERC721Full.sol";

contract Secret is ERC721Full {
  string[] public secrets;
  mapping(string => bool) _secretExists;

  constructor() ERC721Full("Secret", "SECRET") public {
  }

function concatenate (
        string memory a,
        string memory b)
        internal 
        returns(string memory) {
            return string(abi.encodePacked(a, b));
        }


  // E.G. secret = "I know how transform gold into bitcoin"
  function mint(string memory _secret, string memory _secret_id) public {
   // require(!_secretExists[_secret]);
    uint _id = secrets.push(_secret);
    _mint(msg.sender, _id);
    _secretExists[_secret] = true;
    string memory baseURI = 'http://localhost:8080/webservice-php-json/get_token_info.php?uid=';
    string memory myURI = concatenate(baseURI,_secret_id); 
    _setTokenURI(_id, myURI);
  }

function tokensOfOwner(address  owner) public view returns (uint256[] memory) {
 // address   myAddress = 0x43950Ed9F4331F8c9Abd030A2B1cdA52Fc6Fa8e3;
  return _tokensOfOwner(owner);
    }

}
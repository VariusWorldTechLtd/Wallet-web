pragma solidity ^0.4.24;

contract LoginSession {
    address private owner;
    address private loggedAccount;
    string private accountPubKey;

    // User data
    string private firstname;
    string private lastname;
    string private age;
    string private gender;

    event SaveSessionEvent(string message);
    event SaveDataEvent(string message);

    modifier onlyOwner() {
        require(owner == msg.sender, "You are not the owner of this conrtact");
        _;
    }
    
    modifier onlyLogged() {
        require(loggedAccount == msg.sender, "You are not the logged in user");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    // Web calls this to give Mobile app rights to call SaveData
    function saveSession(string _accountPubKey, address _loggedAccount) public onlyOwner {
        accountPubKey = _accountPubKey;
        loggedAccount = _loggedAccount;

        emit SaveSessionEvent("Saved Session");
    }

    // Can only be called after Web (contract deployer) has saved that address
    function SaveData(string _firstname, string _lastname, string _age, string _gender) public onlyLogged {
        firstname = _firstname;
        lastname = _lastname;
        age = _age;
        gender = _gender;

        emit SaveDataEvent("Data saved");
    }

    // Can only be called by the web
    function GetData() public view onlyOwner returns(string _firstname, string _lastname, string _age, string _gender) {
        _firstname = firstname;
        _lastname = lastname;
        _age = age;
        _gender = gender;

        return;
    }

    // mobile calls this to get the public key of the web app and uses it to encrypt data that only the web can decrypt
    function GetAccountPubKey() public view onlyLogged returns(string) {
        return accountPubKey;
    }
}
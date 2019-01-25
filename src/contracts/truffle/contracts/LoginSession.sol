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

    function saveSession(string _accountPubKey, address _loggedAccount) public onlyOwner {
        accountPubKey = _accountPubKey;
        loggedAccount = _loggedAccount;

        emit SaveSessionEvent("Saved Session");
    }

    function SaveData(string _firstname, string _lastname, string _age, string _gender) public onlyLogged {
        firstname = _firstname;
        lastname = _lastname;
        age = _age;
        gender = _gender;

        emit SaveDataEvent("Data saved");
    }

    function GetData() public view onlyOwner returns(string _firstname, string _lastname, string _age, string _gender) {
        _firstname = firstname;
        _lastname = lastname;
        _age = age;
        _gender = gender;

        return;
    }

    function GetAccountPubKey() public view onlyLogged returns(string) {
        return accountPubKey;
    }
}
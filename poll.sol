// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract PollContract{

    struct Poll{
        uint256 id;
        string question;
        string thumbnail;
        uint64[] votes;
        bytes32[] options;
        
    }
    
    struct Voter {
        address id; //hash of the votes
        uint256[] votedIds;
        mapping(uint256=>bool) votedMap;
    }
    
    Poll[] private polls;
    mapping(address=>Voter) voters;
    
    event pollCreated(uint256 _pollid);
    event voteCreated(uint256 _pollid);
    
    function createPoll(string memory _question, string memory _thumbnail, bytes32[] memory _options) public{
        require(bytes(_question).length>0,"Empty Question");
        require(_options.length>1,"Atleast two options");
        
        uint256 pollid = polls.length;
        
        Poll memory newPoll = Poll({
                id:pollid,
                question:_question,
                thumbnail:_thumbnail,
                votes:new uint64[](_options.length),
                options:_options
        });
        
        polls.push(newPoll);
        emit pollCreated(pollid);
    }
    
    function getPoll(uint256 _pollid) external view returns(uint256,string memory, string memory, uint64[] memory,  bytes32[] memory){
       require(_pollid <polls.length && _pollid>=0,"No polls found");
        return (
                polls[_pollid].id,
                polls[_pollid].question,
                polls[_pollid].thumbnail,
                polls[_pollid].votes,
                polls[_pollid].options
            );
    }
     
    function vote(uint256 _pollid, uint64 _vote) external{
        require(_pollid <polls.length && _pollid>=0,"poll doesnot exist");
        require(_vote< polls[_pollid].options.length,"Invalid vote");
        require(voters[msg.sender].votedMap[_pollid]== false,"You aready voted");
        
        polls[_pollid].votes[_vote] +=1;
        
        voters[msg.sender].votedIds.push(_pollid);
        voters[msg.sender].votedMap[_pollid] = true;
        emit voteCreated(_pollid);
    }
    
    function getVoter(address _id) external view returns(address, uint256[] memory){
        return( 
            voters[_id].id,
            voters[_id].votedIds 
            );
    }
    function totalPolls() external view returns(uint256){
        return polls.length;
    }
}
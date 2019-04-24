/**
* The Block Chain program implements an application that
* scalable solution to current and outdated voting methods 
    by providing secure and fraud-proof digital voting Using BlockChain
* @version 1.0
* @since   2018-04-17 
*/
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const path = require('path');
const router = express.Router();
var hashResult ;


app.use(bodyParser.urlencoded({ extended: true })); 
const SHA256 = require("crypto-js/sha256");


/**

 *

Vote class with Constructor candidate Person
 */
class Vote{
    constructor(voteOne, voteTwo, voteThree){
        this.personOne = voteOne;
        this.personTwo = voteTwo;
        this.personThree = voteThree;
    }
}

/**
 *
Block class contains element of Block
@param timestamp
@param votes
@param previousHash 
@param nonce =0
 */
class Block {
    constructor(timestamp, votes, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.votes = votes;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    /**
     *
     calculateHash of Block
     * @returns { Hash of @param previousHash +
                        @param timestamp+ 
                        @param votes}
                        @param nonce
     */
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.votes) + this.nonce).toString();
    }

    /**
     *
     mine Block increase difficulty for every Block 
     * @param difficulty
     */
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
       hashResult = "BLOCK MINED: " + this.hash;
        // console.log("BLOCK MINED: " + this.hash);
    }
}

/**
 *
 Blcochain Class 
 */
class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.pendingVotes = [];
    }

    /**
     *
     * @returns {Block}
     */
    createGenesisBlock() {
        return new Block(Date.parse("2018-01-01"), [], "0");
    }

    /**
     *
     * @returns {Last Block }
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     *
     mine Block of Chain Voting to calculate number of Voting for every candidate Person
          and Increase difficulty
     */
    minePendingVotes(){
        let block = new Block(Date.now(), this.pendingVotes, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        hashResult += 'Block successfully mined!'+ '\n';
        // console.log('Block successfully mined!');
        this.chain.push(block);

    }

    /**
     *
     * @param vote
     */
    createVote(vote){
        this.pendingVotes = [];

        this.pendingVotes.push(vote);
    }

    /**
     *
     * @returns {number[Voting]}
     */
    getVotesCount(){
        
     let votesCount = [0, 0, 0];

        for(const block of this.chain){
            for(const vote of block.votes){
                if(vote.personOne === 1){
                    votesCount[0]++; 
                }

                if(vote.personTwo === 1){
                    votesCount[1]++;
                }

                if(vote.personThree === 1){
                    votesCount[2]++;
                }
            }
        }
        hashResult += "Voting Counter:\n" ; 
         hashResult +="Person One has "+ votesCount[0]+" Votes \n"  ; 
          hashResult += "Person Two has "+votesCount[1]+" Votes \n" ; 
           hashResult +="Person Three has "+votesCount[2]+" Votes \n"  ;
        // console.log("Voting Counter:\n");
        // console.log("Person One has ",votesCount[0]," Votes");
        // console.log("Person Two has ",votesCount[1]," Votes");
        // console.log("Person Three has ",votesCount[2]," Votes");
        return votesCount;
    }

    /**
     *
     * @returns {boolean Valid}
     */
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

    /**
     *
     */
    traceChain(){

        for (let i = 0; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            hashResult += JSON.stringify(currentBlock, undefined, 2) ;
            // console.log(JSON.stringify(currentBlock, undefined, 2));
        }

    }
}

/**
 *
 * @type {Blockchain}
 */
let myVoteSystem = new Blockchain();
/**
 *
 */


//console.log('\n Starting the miner...');


app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.post('/', (req, res) => {
    var v1,v2,v3;
    if(req.body.Person1 == 1){
        v1 = 1;
    }else{
        v1 =0;
    }
    if(req.body.Person2 == 1){
        v2 = 1;
    }else{
        v2 =0;
    }
    if(req.body.Person3 == 1){
        v3 = 1;
    }else{
        v3 =0;
    }
    myVoteSystem.createVote(new Vote(v1, v2, v3));

    myVoteSystem.minePendingVotes();

      myVoteSystem.getVotesCount();

      hashResult += "\nBlockchain:\n ";
      // console.log('\nBlockchain:\n');
     myVoteSystem.traceChain();

   res.redirect('/');
});
app.get('/result',function(req,res) {
 res.send( hashResult);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
 console.log('Result page at : http://localhost:3000/result');



/**
 *
 */

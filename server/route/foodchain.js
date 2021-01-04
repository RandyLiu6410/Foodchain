const router = require('express').Router();

const Web3 = require('web3');
const quorumjs = require('quorum-js');
const web3 = new Web3(process.env.NODE1);
quorumjs.extend(web3);
const acc = web3.eth.accounts.privateKeyToAccount('0xab09158d9a817633c28c74b6e6c1bf34c26ffadc1a961870beaeef38b0753495');
web3.eth.accounts.wallet.add(acc);

var abi = require('../food3.json');
const contract = new web3.eth.Contract(abi, '0xA4fafbE0ea4823e262b4916EF93CC5A6306A5DBc');
// get
// input: logorg, output: logno[]
router.route('/logno').get((req, res) => {
    // console.log(req);
    contract.getPastEvents("allEvents",
        {                               
            fromBlock: req.query.START_BLOCK,     
            toBlock: 'latest'        
        })                              
    .then(events => {
        const result = events.filter(e => e.returnValues['logorg'] === req.query.logorg);
        const lognos = [];
        console.log(result.length)
        result.forEach(function(item) {
            lognos.push(item.returnValues['logno']);
        });
        if(lognos){
            res.json(lognos);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: FoodContent
router.route('/foodcontent').get((req, res) => {
    web3.eth.getBlockNumber().then(console.log);
    LAST_BLOCK = web3.eth.getBlockNumber();
    contract.getPastEvents("FoodContent",
        {                               
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        const result = events.filter(e => e.returnValues['logno'] === req.query.logno);
        if(result){
            res.json(result);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: FoodImage
router.route('/foodimage').get((req, res) => {
    web3.eth.getBlockNumber().then(console.log);
    LAST_BLOCK = web3.eth.getBlockNumber();
    contract.getPastEvents("FoodImage",
        {                               
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        const result = events.filter(e => e.returnValues['logno'] === req.query.logno);
        if(result){
            res.json(result);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: FoodImageReplace
router.route('/foodimagereplace').get((req, res) => {
    web3.eth.getBlockNumber().then(console.log);
    LAST_BLOCK = web3.eth.getBlockNumber();
    contract.getPastEvents("FoodImageReplace",
        {                               
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        const result = events.filter(e => e.returnValues['logno'] === req.query.logno);
        if(result){
            res.json(result);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: FoodItem
router.route('/fooditem').get((req, res) => {
    web3.eth.getBlockNumber().then(console.log);
    LAST_BLOCK = web3.eth.getBlockNumber();
    contract.getPastEvents("FoodItem",
        {                               
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        const result = events.filter(e => e.returnValues['logno'] === req.query.logno);
        if(result){
            res.json(result);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: FoodSection
router.route('/foodsection').get((req, res) => {
    web3.eth.getBlockNumber().then(console.log);
    LAST_BLOCK = web3.eth.getBlockNumber();
    contract.getPastEvents("FoodSection",
        {                               
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        const result = events.filter(e => e.returnValues['logno'] === req.query.logno);
        if(result){
            res.json(result);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: allevents
router.route('/allevents').get((req, res) => {
    web3.eth.getBlockNumber().then(console.log);
    LAST_BLOCK = web3.eth.getBlockNumber();
    contract.getPastEvents("allEvents",
        {                               
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        const result = events.filter(e => e.returnValues['logno'] === req.query.logno);
        if(result){
            res.json(result);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});


//post

// FoodLog
router.route('/foodlog').post(async (req, res) => {
    await contract.methods.FoodLog(parseInt(req.query.logno), req.query.loghash, req.query.logname, req.query.logorg, req.query.logdate)
    .send({from: web3.eth.accounts.wallet[0].address, gas: 30104}, (err, result) => {res.json(result)})
    .on('error', function (error) {
        console.log(error);
    })
});
// FoodLogImage
router.route('/foodlogimage').post(async (req, res) => {
    await contract.methods.FoodLogImage(parseInt(req.query.logno), req.query.url, req.query.filehash)
    .send({from: web3.eth.accounts.wallet[0].address, gas: 40664}, (err, result) => {res.json(result)})
    .on('error', function (error) {
        console.log(error);
    })
});
// FoodLogSection
router.route('/foodlogsection').post(async (req, res) => {
    await contract.methods.FoodLogSection(parseInt(req.query.logno), req.query.title, req.query.begin, req.query.end)
    .send({from: web3.eth.accounts.wallet[0].address, gas: 28455}, (err, result) => {res.json(result)})
    .on('error', function (error) {
        console.log(error);
    })
    // .on('transactionHash', function (transactionHash) {
    //     res.json({"TransactionHash": transactionHash});
    // })
    // .on('receipt', function (receipt) {
    //     res.json({"Contract address": receipt.contractAddress}) // contains the new contract address
    // })
    // .on('confirmation', function (confirmationNumber, receipt) {
    //     res.json(receipt);
    // })
});

module.exports = router;
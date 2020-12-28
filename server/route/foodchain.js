const router = require('express').Router();

const Web3 = require('web3');
const quorumjs = require('quorum-js');
const web3 = new Web3(process.env.NODE3);
quorumjs.extend(web3);
const acc = web3.eth.accounts.privateKeyToAccount('c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3');
web3.eth.accounts.wallet.add(acc);

var abi = require('../food3.json');
const contract = new web3.eth.Contract(abi, '0xA4fafbE0ea4823e262b4916EF93CC5A6306A5DBc');

router.route('/').get((req, res) => {
    contract.getPastEvents("allEvents",
        {                               
            fromBlock: req.query.START_BLOCK,     
            toBlock: 'latest'        
        })                              
    .then(events => {
        const result = events.find(e => e.returnValues['logno'] === req.query.logno);
        if(result){
            res.json(result);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

router.route('/').post(async (req, res) => {
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
const router = require('express').Router();
let Food = require('../model/food.model');

const Web3 = require('web3');
const quorumjs = require('quorum-js');
const web3 = new Web3(process.env.NODE1);
quorumjs.extend(web3);

const CONTRACT_ADDRESS = "0xA4fafbE0ea4823e262b4916EF93CC5A6306A5DBc"

const ACCOUNT_ADDRESS = '0x7CbEb723CA0788af6549110fb2a9816ED0BAa1a6';
const PRIVATE_KEY = '0xab09158d9a817633c28c74b6e6c1bf34c26ffadc1a961870beaeef38b0753495';

const acc = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(acc);

var abi = require('../food3.json');
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
// get
// input: logorg, output: logno[]
router.route('/logno').get((req, res) => {
    contract.getPastEvents("FoodContent",
        {                               
            fromBlock: req.query.START_BLOCK,     
            toBlock: 'latest'        
        })                              
    .then(events => {
        const result = events.filter(e => e.returnValues['logorg'] === req.query.logorg);
        const lognos = [];
        result.forEach(function(item) {
            if(!lognos.includes(item.returnValues['logno']))
            {
                lognos.push(item.returnValues['logno']);
            }
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
    contract.getPastEvents("FoodContent",
        {                               
            filter: {logno: req.query.logno},
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        if(events){
            res.json(events);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: FoodImage
router.route('/foodimage').get((req, res) => {
    contract.getPastEvents("FoodImage",
        {                               
            filter: {logno: req.query.logno},
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        if(events){
            res.json(events);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: FoodImageReplace
router.route('/foodimagereplace').get((req, res) => {
    contract.getPastEvents("FoodImageReplace",
        {                               
            filter: {logno: req.query.logno},
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        if(events){
            res.json(events);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: FoodItem
router.route('/fooditem').get((req, res) => {
    contract.getPastEvents("FoodItem",
        {                               
            filter: {logno: req.query.logno},
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        if(events){
            res.json(events);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: FoodSection
router.route('/newfoodsection').get((req, res) => {
    Food.findOne({logno: parseInt(req.query.logno)})
    .then((result) => {
        if(result)
        {
            res.status(200);
            res.json(result);
        }
        else
        {
            res.status(400);
            res.json('No result');
        }
    })
    .catch((err) => {
        res.status(400);
        res.json(err);
    })
});

// input: logno, output: FoodSection
router.route('/foodsection').get((req, res) => {
    contract.getPastEvents("FoodSection",
        {                               
            filter: {logno: req.query.logno},
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        if(events){
            res.json(events);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});

// input: logno, output: allevents
router.route('/allevents').get((req, res) => {
    contract.getPastEvents("allEvents",
        {                            
            filter: {logno: req.query.logno},   
            fromBlock: req.query.START_BLOCK,     
            toBlock: "latest"        
        })                              
    .then(events => {
        if(events){
            res.json(events);
        }else {
            res.json('no result');
        }
    })
    .catch((err) => console.error(err));
});


//post

// FoodLog
router.route('/foodlog').post(async (req, res) => {
    var encoded_data = contract.methods.FoodLog(parseInt(req.query.logno), req.query.loghash, req.query.logname, req.query.logorg, req.query.logdate).encodeABI();
    const accountNonce = '0x' + (web3.eth.getTransactionCount(ACCOUNT_ADDRESS) + 1).toString(16);
    
    var tx = {
        nouce: accountNonce,
        from: ACCOUNT_ADDRESS,
        to: CONTRACT_ADDRESS,
        gas: 238960,
        data: encoded_data,
    }

    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    .then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction)
        .on('receipt', (receipt) => {
            const newFood = new Food({
                logno: parseInt(req.query.logno),
                section: [],
                logname: req.query.logname,
                logorg: req.query.logorg,
                logdate: req.query.logdate,
            });

            Food.findOne({logno: parseInt(req.query.logno)})
            .then((result) => {
                if(result)
                {
                    res.status(400);
                    res.json('User exists');
                }
                else
                {
                    newFood.save()
                    .then(() => {
                        res.status(200);
                        console.log(receipt);
                        res.json(receipt);
                    })
                    .catch((err) => {
                        res.status(400);
                        console.log(err);
                        res.json(err);
                    });
                }
            })
            .catch((err) => {
                res.status(400);
                console.log(err);
                res.json(err);
            })
        })
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));

    // await contract.methods.FoodLog(parseInt(req.query.logno), req.query.loghash, req.query.logname, req.query.logorg, req.query.logdate)
    // .send({from: web3.eth.accounts.wallet[0].address, gas: 40664}, (err, result) => {res.json(result)})
    // .on('error', function (error) {
    //     console.log(error);
    // })
});
// FoodLogImage
router.route('/foodlogimage').post(async (req, res) => {
    var encoded_data = contract.methods.FoodLogImage(parseInt(req.query.logno), req.query.url, req.query.filehash).encodeABI();
    const accountNonce = '0x' + (web3.eth.getTransactionCount(ACCOUNT_ADDRESS) + 1).toString(16);
    
    var tx = {
        nouce: accountNonce,
        from: ACCOUNT_ADDRESS,
        to: CONTRACT_ADDRESS,
        gas: 238960,
        data: encoded_data,
    }

    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    .then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction)
        .on('receipt', (receipt) => res.json(receipt))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));

    // await contract.methods.FoodLogImage(parseInt(req.query.logno), req.query.url, req.query.filehash)
    // .send({from: web3.eth.accounts.wallet[0].address, gas: 60664}, (err, result) => {res.json(result)})
    // .on('error', function (error) {
    //     console.log(error);
    // })
});
// FoodLogSection
router.route('/foodlogsection').post(async (req, res) => {
    var encoded_data = contract.methods.FoodLogSection(parseInt(req.query.logno), req.query.title, req.query.begin, req.query.end).encodeABI();
    const accountNonce = '0x' + (web3.eth.getTransactionCount(ACCOUNT_ADDRESS) + 1).toString(16);
    
    var tx = {
        nouce: accountNonce,
        from: ACCOUNT_ADDRESS,
        to: CONTRACT_ADDRESS,
        gas: 238960,
        data: encoded_data,
    }

    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    .then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction)
        .on('receipt', (receipt) => res.json(receipt))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));

    // await contract.methods.FoodLogSection(parseInt(req.query.logno), req.query.title, req.query.begin, req.query.end)
    // .send({from: web3.eth.accounts.wallet[0].address, gas: 28455}, (err, result) => {res.json(result)})
    // .on('error', function (error) {
    //     console.log(error);
    // })
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

// logno, title, begin, end, url, urlhash, filehash
router.route('/newfoodlogsection').post(async (req, res) => {
    var responce = [];
    var error = [];

    var encoded_data1 = contract.methods.FoodLogSection(parseInt(req.query.logno), req.query.title, req.query.begin, req.query.end).encodeABI();
    const accountNonce1 = '0x' + (web3.eth.getTransactionCount(ACCOUNT_ADDRESS) + 1).toString(16);
    
    var tx1 = {
        nouce: accountNonce1,
        from: ACCOUNT_ADDRESS,
        to: CONTRACT_ADDRESS,
        gas: 238960,
        data: encoded_data1,
    }

    web3.eth.accounts.signTransaction(tx1, PRIVATE_KEY)
    .then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction)
        .on('receipt', (receipt) => {
            responce.push(receipt);

            var encoded_data2 = contract.methods.FoodLogImage(parseInt(req.query.logno), req.query.urlhash, req.query.filehash).encodeABI();
            const accountNonce2 = '0x' + (web3.eth.getTransactionCount(ACCOUNT_ADDRESS) + 1).toString(16);
            
            var tx2 = {
                nouce: accountNonce2,
                from: ACCOUNT_ADDRESS,
                to: CONTRACT_ADDRESS,
                gas: 238960,
                data: encoded_data2,
            }
        
            web3.eth.accounts.signTransaction(tx2, PRIVATE_KEY)
            .then(signed => {
                web3.eth.sendSignedTransaction(signed.rawTransaction)
                .on('receipt', (receipt) => {
                    responce.push(receipt);

                    Food.updateOne(
                        { logno: parseInt(req.query.logno) }, 
                        { $push: { section: {
                            title: req.query.title,
                            begin: req.query.begin,
                            end: req.query.end,
                            url: req.query.url,
                        } } },
                        () => {
                            res.status(200);
                            console.log(responce);
                            res.json(responce);
                        }
                    );
                })
                .catch((err) => {
                    res.status(400);
                    console.log(error);
                    res.json(error);
                });
            })
            .catch((err) => {
                res.status(400);
                console.log(error);
                res.json(error);
            });
        })
        .catch((err) => {
            res.status(400);
            console.log(error);
            res.json(error);
        });
    })
    .catch((err) => {
        res.status(400);
        console.log(error);
        res.json(error);
    });
});

module.exports = router;
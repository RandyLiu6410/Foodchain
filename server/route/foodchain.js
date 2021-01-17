const router = require('express').Router();
let Food = require('../model/food.model');
const crypto = require('crypto');
const Web3 = require('web3');
const quorumjs = require('quorum-js');
const web3 = new Web3(process.env.NODE2);
const keccak = require('keccak');
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
			res.json('no result on chain');
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
		if(events.length != 0){
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

// new : add validation between DB and chain
// events : data on chain
// result : data in DB
// input: logno, output: FoodContent
router.route('/newfoodcontent').get((req, res) => {
	contract.getPastEvents("FoodContent",
		{                               
			filter: {logno: req.query.logno},
			fromBlock: req.query.START_BLOCK,     
			toBlock: "latest"        
		})                              
	.then(events => {
		if(events.length != 0)
		{
			Food.findOne({logno: parseInt(req.query.logno)})
			.then((result) => {
				if(result.image.length != 0)
				{
					// console.log("#foodimage on chain:", events.length);
					// console.log("#foodimage in DB:", result.content.length);
					// res.json(result.content);
					if(events.length == result.content.length)
					{
						console.log("#content in DB and on chain is equal.");
						var validated = 1;
						for(var i = 0; i < events.length; i++)
						{ 
							const logname_hash_db = '0x'+keccak('keccak256').update(result.content[i].logname).digest('hex');
							const logorg_hash_db = '0x'+keccak('keccak256').update(result.content[i].logorg).digest('hex');
							console.log('logname_hash_DB:', logname_hash_db);
							console.log('logname_hash_OC:', events[i].returnValues.logname);
							console.log('logorg_hash_OC:', logorg_hash_db);
							console.log('logorg_hash_OC:', events[i].returnValues.logorg);
							if(logname_hash_db != events[i].returnValues.logname || logorg_hash_db != events[i].returnValues.logorg)
							{
								console.log('data in DB and on chain are inconsistent!');
								validated = 0;
								res.status(400);
								res.json('data in DB and on chain are inconsistent!');
								break;
							}
						}
						if(validated)
						{
							console.log('data in DB and on chain are consistent.');
							res.status(200);
							res.json(result.content);
						}
					}
					else
					{
						console.log("#content in DB and on chain isn't equal.");
						res.status(400);
						res.json("#content in DB and on chain isn't equal.");
					}
				}
				else
				{
					res.status(400);
					res.json("logno's content doesn't exist in DB");
				}
			})
			.catch((err) => {
				res.status(400);
				res.json(err);
			})
		}
		else
		{
			res.status(400);
			res.json("logno's content doesn't exist on chain");
		}
	})
	.catch((err) => console.error(err));
});

// Problem : can't find any FoodImage event on chain 
// input: logno, output: FoodImage
router.route('/newfoodimage').get((req, res) => {
	contract.getPastEvents("FoodImage",
		{                               
			filter: {logno: req.query.logno},
			fromBlock: req.query.START_BLOCK,     
			toBlock: "latest"        
		})                              
	.then(events => {
		if(events)
		{
			Food.findOne({logno: parseInt(req.query.logno)})
			.then((result) => {
				if(result.image.length != 0)
				{
					console.log("#foodimage on chain:", events.length);
					console.log("#foodimage in DB:", result.image.length);
					res.json(result.image);
					if(events.length == result.image.length)
					{
						console.log("#image in DB and on chain is equal.");
						var validated = 1;
						for(var i = 0; i < events.length; i++)
						{ 
							const url_hash_db = '0x'+keccak('keccak256').update(result.image[i].url).digest('hex');
							const filehash_hash_db = '0x'+keccak('keccak256').update(result.image[i].filehash).digest('hex');
							console.log('url_hash_DB:', url_hash_db);
							console.log('url_hash_OC:', events[i].returnValues.url);
							console.log('filehash_hash_DB:', filehash_hash_db);
							console.log('filehash_hash_OC:', events[i].returnValues.filehash);
							if(url_hash_db != events[i].returnValues.url || filehash_hash_db != events[i].returnValues.filehash)
							{
								console.log('data in DB and on chain are inconsistent!');
								validated = 0;
								res.status(400);
								res.json('data in DB and on chain are inconsistent!');
								break;
							}
						}
						if(validated)
						{
							console.log('data in DB and on chain are consistent.');
							res.status(200);
							res.json(result.image);
						}
					}
					else
					{
						console.log("#image in DB and on chain isn't equal.");
						res.status(400);
						res.json("#image in DB and on chain isn't equal.");
					}
				}
				else
				{
					res.status(400);
					res.json("logno's image doesn't exist in DB");
				}
			})
			.catch((err) => {
				res.status(400);
				res.json(err);
			})
		}
		else
		{
			res.status(400);
			res.json("logno's image doesn't exist on chain");
		}
	})
	.catch((err) => console.error(err));
});

// input: logno, output: FoodItem
router.route('/newfooditem').get((req, res) => {
	contract.getPastEvents("FoodItem",
		{                               
			filter: {logno: req.query.logno},
			fromBlock: req.query.START_BLOCK,     
			toBlock: "latest"        
		})                              
	.then(events => {
		if(events.length != 0)
		{
			Food.findOne({logno: parseInt(req.query.logno)})
			.then((result) => {
				if(result.item.length != 0)
				{
					// console.log("#foodsection on chain:", events.length);
					// console.log("#foodsection in DB:", result.section.length);
					if(events.length == result.item.length)
					{
						console.log("#item in DB and on chain is equal.");
						var validated = 1;
						for(var i = 0; i < events.length; i++)
						{ 
							const loghash_hash_db = '0x'+keccak('keccak256').update(result.item[i].loghash).digest('hex');
							const logdate_hash_db = '0x'+keccak('keccak256').update(result.item[i].logdate).digest('hex');
							console.log('loghash_hash_DB:', loghash_hash_db);
							console.log('loghash_hash_OC:', events[i].returnValues.loghash);
							console.log('logdate_hash_DB:', logdate_hash_db);
							console.log('logdate_hash_OC:', events[i].returnValues.logdate);
							if(loghash_hash_db != events[i].returnValues.loghash || logdate_hash_db != events[i].returnValues.logdate)
							{
								console.log('data in DB and on chain are inconsistent!');
								validated = 0;
								res.status(400);
								res.json('data in DB and on chain are inconsistent!');
								break;
							}
						}
						if(validated)
						{
							console.log('data in DB and on chain are consistent.');
							res.status(200);
							res.json(result.item);
						}
					}
					else
					{
						console.log("#item in DB and on chain isn't equal.");
						res.status(400);
						res.json("#item in DB and on chain isn't equal.");
					}
				}
				else
				{
					res.status(400);
					res.json("logno's item doesn't exist in DB");
				}
			})
			.catch((err) => {
				res.status(400);
				res.json(err);
			})
		}
		else
		{
			res.status(400);
			res.json("logno's item doesn't exist on chain");
		}
	})
	.catch((err) => console.error(err));
});

// input: logno, output: FoodSection
router.route('/newfoodsection').get((req, res) => {
	//data on chain: events
	contract.getPastEvents("FoodSection",
	{                               
		filter: {logno: req.query.logno},
		fromBlock: req.query.START_BLOCK,     
		toBlock: "latest"        
	})                           
	.then(events => {
		if(events.length != 0)
		{
			Food.findOne({logno: parseInt(req.query.logno)})
			.then((result) => {
				if(result.section.length != 0)
				{
					// console.log("#foodsection on chain:", events.length);
					// console.log("#foodsection in DB:", result.section.length);
					if(events.length == result.section.length)
					{
						console.log("#section in DB and on chain is equal.");
						var validated = 1;
						for(var i = 0; i < events.length; i++)
						{ 
							const begin_hash_db = '0x'+keccak('keccak256').update(result.section[i].begin).digest('hex');
							const end_hash_db = '0x'+keccak('keccak256').update(result.section[i].end).digest('hex');
							console.log('title_DB:', result.section[i].title);
							console.log('title_OC:', events[i].returnValues.title);
							console.log('begin_hash_DB:', begin_hash_db);
							console.log('begin_hash_OC:', events[i].returnValues.begin);
							console.log('end_hash_DB:', end_hash_db);
							console.log('end_hash_OC:', events[i].returnValues.end);
							if(begin_hash_db != events[i].returnValues.begin || end_hash_db != events[i].returnValues.end
								|| result.section[i].title != events[i].returnValues.title)
							{
								console.log('data in DB and on chain are inconsistent!');
								validated = 0;
								res.status(400);
								res.json('data in DB and on chain are inconsistent!');
								break;
							}
						}
						if(validated)
						{
							console.log('data in DB and on chain are consistent.');
							res.status(200);
							res.json(result.section);
						}
					}
					else
					{
						console.log("#section in DB and on chain isn't equal.");
						res.status(400);
						res.json("#section in DB and on chain isn't equal.");
					}
				}
				else
				{
					res.status(400);
					res.json("logno's section doesn't exist in DB");
				}
			})
			.catch((err) => {
				res.status(400);
				res.json(err);
			})
		}
		else
		{
			res.status(400);
			res.json("logno's section doesn't exist on chain");
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
				content: [{
					logname: req.query.logname,
					logorg: req.query.logorg,
				}],
				item: [{
					loghash: req.query.loghash,
					logdate: req.query.logdate,
				}],
			});

			Food.findOne({logno: parseInt(req.query.logno)})
			.then((result) => {
				if(result)
				{
					result.content.push({
						logname: req.query.logname,
						logorg: req.query.logorg,
					});
					result.item.push({
						loghash: req.query.loghash,
						logdate: req.query.logdate,
					});
					result.save();
					res.status(200);
					res.json(receipt);
					console.log('push to existing log.')
				}
				else
				{
					newFood.save()
					.then(() => {
						res.status(200);
						console.log(receipt);
						res.json(receipt);
						console.log("create a new log.")
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
		.on('receipt', (receipt) => {
				const newFood = new Food({
				logno: parseInt(req.query.logno),
				image: [{
					url: req.query.url,
					filehash: req.query.filehash,
				}],
			});

			Food.findOne({logno: parseInt(req.query.logno)})
			.then((result) => {
				if(result)
				{			
					result.image.push({
					// transactionhash: receipt.logs[0].transactionHash,
					url: req.query.url,
					filehash: req.query.filehash,
				});
					result.save();
					res.status(200);
					res.json(receipt);
					console.log("push to existing log.")
				}
				else
				{
					newFood.save()
					.then(() => {
						res.status(200);
						// console.log(receipt);
						res.json(receipt);
					})
					.catch((err) => {
						res.status(400);
						console.log(err);
						res.json(err);
					});
					console.log("create a new log.")
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
});

// FoodLogSection
router.route('/foodlogsection').post(async (req, res) => {
	var encoded_data = contract.methods.FoodLogSection(parseInt(req.query.logno), req.query.title, req.query.begin, req.query.end).encodeABI();
	const accountNonce = '0x' + (web3.eth.getTransactionCount(ACCOUNT_ADDRESS) + 1).toString(16);
	// console.log('encoded_data', encoded_data)
	
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
		.on('receipt', (receipt) =>{
			const newFood = new Food({
				logno: parseInt(req.query.logno),
				section: [{
					transactionhash: receipt.logs[0].transactionHash,
					title: req.query.title,
					begin: req.query.begin,
					end: req.query.end
				}],
			});

			Food.findOne({logno: parseInt(req.query.logno)})
			.then((result) => {
				if(result)
				{			
					result.section.push({
					// transactionhash: receipt.logs[0].transactionHash,
					title: req.query.title,
					begin: req.query.begin,
					end: req.query.end
				});
					result.save();
					res.status(200);
					res.json(receipt);
					console.log("push to existing log.")
				}
				else
				{
					newFood.save()
					.then(() => {
						res.status(200);
						// console.log(receipt);
						res.json(receipt);
					})
					.catch((err) => {
						res.status(400);
						console.log(err);
						res.json(err);
					});
					console.log("create a new log.")
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
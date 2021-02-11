const {generate} = require('../dist');

// example  from https://github.com/Arachnid/deterministic-deployment-proxy/
console.log(
	generate(
		"0x604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3",
		{
			gasPrice: '100000000000',
			gasLimit: 100000
		}
	)
);

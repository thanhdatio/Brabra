//Global variables
let Bullbear;
let ethUsd;
const deployedNetwork = 137;//To which network is the contract deployed? Ganache: 5777, Ropsten: 3, Mainnet: 1
const contractAddress = "0x33Dc77FBff64847E8cbdBbdAD765F89E50794d96";//Contract address on matic
// const contractAddress = "0x1e03A56F8bcb6f7F40288d630AB5f8Db0C6aa327";//Contract address on Ganache
let provider;
let signer;
let swissFranc;
let headsOrTailsSelection;
const wmaticAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";



//Reload web3 on network change (setTimeout needed, because else "window.ethereum.on('networkChanged',..."
//would be triggered on page load --> loadWeb3() would be fired twice)
setTimeout(() => {
  if(!window.ethereum) return;//ignore this function in case of non-ethereum browser
  window.ethereum.on('networkChanged', function (netId) {
    console.log("network has changed. New id: " + netId);
    loadWeb3(); //load all relevant infos in order to interact with Ethereum
  })
}, 500);

//Load web3 interface or get read access via Infura
async function loadWeb3() {
  // Connect to the network
  // Modern dapp browsers...
  if (window.ethereum) {
    try {
      // Request account access if needed
      await ethereum.enable();//If this doesn't work an error is thrown
      console.log("User has a MODERN dapp browser!");
      showAlert("You are ready to play!", "success");
      provider = new ethers.providers.Web3Provider(ethereum);
      // console.log(provider);
	
      // Acccounts now exposed. Load the contract!
      // loadBlockchainData();
    } catch (error) {
      console.log("There was and error: ", error.message);//In case user denied access
      showAlert("App needs access your account in order to play", "fail");
      //Load blockchain and contract data (jackpot, last games) via ethers default provider (Infura, Etherscan)
      provider = ethers.getDefaultProvider('ropsten');
    }
  }
  // Legacy dapp browsers (acccounts always exposed)...
  else if (window.web3) {
    provider = new ethers.providers.Web3Provider(web3.currentProvider);
    console.log("User has a LEGACY dapp browser!");
    showAlert("You are ready to play!", "success");
    // loadBlockchainData();
  }
  // Non-dapp browsers...
  else {
    //Load blockchain and contract data (jackpot, last games) via ethers default provider (Infura, Etherscan)
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    showAlert("Non-Ethereum browser detected. You should consider trying MetaMask in order to play", "fail");
    provider = ethers.getDefaultProvider('ropsten');
    // console.log(provider);
    // loadBlockchainData();
  }
  loadBlockchainData();
}
//const account = await web3Instance.eth.getAccounts();
//const accountAddress = await account[0];
//Load contract information and define signer & provider
async function loadBlockchainData() {
  //Show link to contract on Etherscan and link to Github repository
  //contractAddressShortened = contractAddress.slice(0, 4) + "..." + contractAddress.slice(-4);
  //document.querySelector(".contract-address").innerHTML = '<a href="https://testnet.bscscan.com/address/' + contractAddress + '">' + contractAddressShortened + '</a> Code on Github: <a href="https://github.com/rene78/Heads-Or-Tails">Heads or Tails</a>';

  //First check if contract is deployed to the network
  let activeNetwork = await provider.getNetwork(provider);
  // console.log(activeNetwork);

  if (activeNetwork.chainId === deployedNetwork) {
    //When connected via Metamask (i.e. "provider.connection" defined) define a signer (for read-write access),
    //else (i.e. non-ethereum browser) use provider (read access only)
    if (provider.connection) signer = provider.getSigner(); else signer = provider;

  } else {
    //Ethereum enabled browser, but wrong network selected.
    showAlert("Please switch to Ropsten test net in order to play", "fail");
    provider = ethers.getDefaultProvider('ropsten');//switch back to default provider in order to read game data and jackpot
    signer = provider; //read only
  }

window.addEventListener('load', () => {
  // swissFranc = three(); //initialize coin
  //setTimeout(1000); ////initialize coin 1sec after load. Without the timeout there are issues due to div resizing
  //setTimeout(() => swissFranc.stopAnimation("heads"), 2000); //stop initial coin animation after 2sec
  setTimeout(() => toggleBlur(), 1000);
  loadWeb3(); //load all relevant infos in order to interact with Ethereum
});

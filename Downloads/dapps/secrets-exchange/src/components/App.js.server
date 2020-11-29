import React, { Component } from 'react';
import Video from 'react-html5video';

//import { View, Image, StyleSheet } from 'react-native';
//import Web3 from 'web3'
import './App.css';
import Secret from '../abis/Secret.json'

import { render } from "react-dom";
import ParticlesBg from "particles-bg";



const Web3 = require('web3')
require('dotenv').config()



console.log('env variables:', process.env.REACT_APP_RPC_URL, process.env.REACT_APP_PRIVATE_KEY)

const web3 = new Web3(process.env.REACT_APP_RPC_URL)
web3.eth.accounts.wallet.add(process.env.REACT_APP_PRIVATE_KEY)

const axios = require('axios')
const moment = require('moment-timezone')

var userAccount = "";
var randomSecret = "";
var randomSecretId = "";

var showResults = true;
//gilles tests var showResults = false;
var showShareMySecretComponent = true;

var iterSecrets = 0;

//choose a random image, assuming images are named by consecutive numbers startting from 0.png
var  randomImage = getRandomInt(5)+1
var  imageUrl = "http://34.67.55.222:8080/images/" + randomImage + '.gif'

let mapTokenImages = new Map();

// UTILITIES

const formUrlEncoded = x =>
   Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')

const now = () => (moment().tz('America/Chicago').format())

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
	    window.close()
    }
  }


  async loadSecretImage (secretTokenURI)  {

   // db.push("/test1","super test");
  var result;
  var res = secretTokenURI.replace("localhost", "34.67.55.222");

 // secretTokenURI = 'http://34.67.55.222:8080/webservice-php-json/get_token_info.php?uid=152'
  console.log('loading secrets from loadsecretimage', res)
	  
  const configaxios = { headers: { 'Content-Type': 'application/x-www-form-urlencoded',
            'access-control-allow-origin':'*',
            'access-control-allow-methods':'GET, POST',
            'access-control-allow-headers' : 'X-Requested-With'
            }};


    var response = await axios.get(res)
    result = response.data.info[0].image_url;


    console.log('result ', result)
    return result;
  
  }

  async loadBlockchainData() {
 	  const web3 = window.web3
	  var accounts
    // Load account
	  if (typeof(web3) == "undefined")
	{
		window.close()
		console.log('web3 undefined!')
	}
	  try {
    accounts = await web3.eth.getAccounts()
    if (typeof(accounts[0]) == "undefined") {
		window.close()
    }
    this.setState({ account: accounts[0] })
    userAccount = accounts[0];
    console.log('account:', accounts[0])
    const userAddress = accounts[0] 
    const networkId = await web3.eth.net.getId()
    const networkData = Secret.networks[networkId]
    if(networkData) {
      const abi = Secret.abi
      const address = networkData.address
      console.log('address', address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      console.log('total supply', totalSupply.toString())
      const tokenIds = await this.state.contract.methods.tokensOfOwner(userAddress).call()

      console.log('token Ids for user', tokenIds.length)
     // console.log('tokenId[0]', tokenIds[0].toString())

      this.setState({ totalSupply })
      // Load Secrets
      for (var i = 1; i <= tokenIds.length; i++) {
        const secret = await contract.methods.secrets(tokenIds[i-1]-1).call()
        console.log('step1:', tokenIds[i-1].toString())
        const myUri = await contract.methods.tokenURI(tokenIds[i-1]).call()
	console.log('myURI', myUri);
        this.setState({
          secrets: [...this.state.secrets, secret]
        })
        const mySecretImgUrl = await this.loadSecretImage(myUri);
        mapTokenImages.set(secret, mySecretImgUrl);   // a string key

      this.setState({ myUri })
      this.setState({ imageUrl })
      showShareMySecretComponent = true;
      this.setState({ showShareMySecretComponent })


        // this.setState({
        //   secreturis:[...this.state.secreturis, myUri]
        // })

        console.log('secret',secret,'token uri', myUri)

      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
	  }
	catch(error) {
	console.log(error)
	}
  }

  mint = (secret,secretId) => {
    console.log(secret)
    this.state.contract.methods.mint(secret,secretId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        secrets: [...this.state.secrets, secret]
      })
    })

    var jsonContent = `{
                        "description": "Secrets exchange metadata file", 
                        "external_url": "https://www.secrets.exchange/", 
                        "name": "Secrets exchange",
                        "image": "http://127.0.0.1:8080/images/${iterSecrets}.png", 
                       }`

    console.log('jsonContent', jsonContent)
    // this.loadBlockchainData()


  showShareMySecretComponent = true;
  //gilles tests showShareMySecretComponent = false;

  this.setState({ showShareMySecretComponent })

  }


  async saveSecret (secret) {

   // db.push("/test1","super test");
    iterSecrets += 1 ;
    console.log('saving secret', iterSecrets.toString())

    const configaxios = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

    axios.post('http://34.67.55.222:8080/webservice-php-json/signup.php', formUrlEncoded({
      secret: secret,
      origin: userAccount,
      image_url: imageUrl,
      date_of_creation:now(),
      approved:0

    }),configaxios)
    .then((response) => {
      console.log(response);
    }, (error) => {
      console.log(error);
    });

    randomSecret =  await this.loadSecret()
    console.log('result final', randomSecret)


    this.setState({ randomSecret })
    showResults = true;
    showShareMySecretComponent = true;
//gilles tests    showShareMySecretComponent = false;

    this.setState({ showResults })
    this.setState({ showShareMySecretComponent })

    this.setState({ randomSecretId })

  }

 async loadSecret ()  {

   // db.push("/test1","super test");
    console.log('loading secrets')
    var result
    const configaxios = { headers: { 'Content-Type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Origin':'*',
            'access-control-allow-methods':'GET, POST',
            'access-control-allow-headers' : 'X-Requested-With'
            }};

    var targetURL = ''
    var response = await axios.get('http://34.67.55.222:8080/webservice-php-json/random_secret.php?uid=17')
    console.log('ressponse', response)
    if (response === undefined || response === null) {
      console.log('empty result when calling axios for random secret')

    } else {
      result = response.data.info[0].secret;
      randomSecretId = response.data.info[0].id;
    }

    console.log('result ', result, 'randomSecretId', randomSecretId)
    return result;
  
  }

 



  displayMessage = () => {
    console.log('displaying this')

  }

  burn = (secret) => {
    this.state.contract.methods.burn(secret).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        secrets: [...this.state.secrets, secret]
      })
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      secrets: []
    }
  }



  render() {


    return (
      <div>
      {/* <ParticlesBg type="cobweb" bg={true}/> */}
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://www.secrets.exchange/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Secrets exchange
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              {/* this.state.showShareMySecretComponent ? */}
                <h1>
                <br />
                  Share your secret and get someone else's
                </h1> 
             {/* : null  */}

                <form onSubmit={(event) => {
                  event.preventDefault()
                  const secret = this.secret.value
                  this.saveSecret(secret) 

                }}>
                 { /*this.state.showShareMySecretComponent ? */}
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. I can transform gold into bitcoin'
                    ref={(input) => { this.secret = input }}
                  />
                {/* : null */}
                 { /*this.state.showShareMySecretComponent ? */}
  
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='Share my secret'
                  />
                {/* : null */}
                </form>
              </div>
            </main>
          </div>

        <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                
{ this.state.showResults ? 
                <h4 className="text-black">
                  <br />
                  Thank you for submitting your secret.<br /><br />
                  </h4>
: null }
{ this.state.showResults ? 

                  <h2>
                  A stranger shared this with you:
                </h2>
: null }
                <br />
{ this.state.showResults ? 

                <h3 className="text-black border=1" >
                  <br />{this.state.randomSecret}<br />
                </h3> 
: null }
                <br/>
                <form onSubmit={(event) => {
                  event.preventDefault()
                 {/* const secret = this.secret.value */}
                  this.displayMessage()
                  this.mint(this.state.randomSecret,this.state.randomSecretId) 
                }}>
                 {/*} <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. I can transform gold into bitcoin'
                    ref={(input) => { this.secret = input }}
                  />*/}
{ this.state.showResults ? 

                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='Mint this secret'
                  />
: null }

                </form>
              </div>
            </main>
          </div>


        <div className="container-fluid mt-5">
             <h2 className="text-black text-center">
                  My minted secrets<br />
             </h2>

<hr  style={{
    color: '#000000',
    backgroundColor: '#000000',
    height: .1,
    borderColor : '#000000',

}}/>

          </div>
          <div className="row text-center ">
         
            { this.state.secrets.map((secret, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                 {/*} <div className="token" style={{ backgroundColor: secret }}></div>*/}
                  <div >
		    <img src={`${mapTokenImages.get(secret)}`} alt={secret} width="300" height="300">
                  </img>

                  <div>{secret}</div>
                  </div>
               
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

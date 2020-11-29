import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Color from '../abis/Color.json'

import { render } from "react-dom";
import ParticlesBg from "particles-bg";


var iterSecrets = 0;

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
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    console.log('account:', accounts[0])
    const userAddress = accounts[0] 
    const networkId = await web3.eth.net.getId()
    const networkData = Color.networks[networkId]
    if(networkData) {
      const abi = Color.abi
      const address = networkData.address
      console.log('address', address)
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      console.log('total supply', totalSupply.toString())
      const tokenIds = await this.state.contract.methods.tokensOfOwner(userAddress).call()

      console.log('token Ids for user', tokenIds.length)
     // console.log('tokenId[0]', tokenIds[0].toString())
 

    /*  
      const myaddress = '0x43950Ed9F4331F8c9Abd030A2B1cdA52Fc6Fa8e3'
web3.eth.call({
    to: myaddress,
    data: contract.methods._tokensOfOwner(myaddress).encodeABI()
}).then(balance => {})
*/

      this.setState({ totalSupply })
      // Load Colors
      for (var i = 1; i <= tokenIds.length; i++) {
        const color = await contract.methods.colors(tokenIds[i-1]-1).call()
        console.log('step1:', tokenIds[i-1].toString())
        const myUri = await contract.methods.tokenURI(tokenIds[i-1]).call()

        this.setState({
          colors: [...this.state.colors, color]
        })


      this.setState({ myUri })
        // this.setState({
        //   secreturis:[...this.state.secreturis, myUri]
        // })

        console.log('color',color,'token uri', myUri)

      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  mint = (color) => {
    console.log(color)
    this.state.contract.methods.mint(color).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })
    })



    var jsonContent = `{
  "description": "Secrets exchange metadata file", 
  "external_url": "https://www.secrets.exchange/", 
  "name": "Secrets exchange",
  "image": "http://127.0.0.1:8080/images/${iterSecrets}.png", 
 }`

 iterSecrets += 1 ;
console.log('jsonContent', jsonContent)
    // this.loadBlockchainData()
  }


  displayMessage = () => {
    console.log('displaying this')

  }

  burn = (color) => {
    this.state.contract.methods.burn(color).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: []
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
                <h1>
                <br />
                  Share your secret and get someone else's
                </h1>

                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. I can transform gold into bitcoin'
                    ref={(input) => { this.color = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='Share my secret'
                  />
                </form>
              </div>
            </main>
          </div>


        <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h3 className="text-black">
                  <br />
                  Thank you for submitting your secret.<br />
                  A stranger shared this with you
                </h3>
                <ul className="navbar-nav px-3">
                  <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                    <small className="text-black"><span id="account">{this.state.myUri}</span></small>
                  </li>
                </ul>

                <form onSubmit={(event) => {
                  event.preventDefault()
                 {/* const color = this.color.value */}
                  this.displayMessage()
                }}>
                 {/*} <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. I can transform gold into bitcoin'
                    ref={(input) => { this.color = input }}
                  />*/}
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='Mint this secret'
                  />
                </form>
              </div>
            </main>
          </div>


          <hr/>
          <div className="row text-center ">
            { this.state.colors.map((color, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>

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

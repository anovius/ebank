
import { Modal } from "@material-ui/core";
import { useEffect, useState } from "react";
import Asset from "../../api/asset";
import Upload from "../../api/upload";
import { environment } from "../../constants";

function Assets() {

  const [open, setOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [assets, setAssets] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [icon, setIcon] = useState("");
  const [full, setFull] = useState("");
  const [name, setName] = useState("");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [stats, setStats] = useState(0);
  const [conversion, setConversion] = useState(0);
  const [percentageCharge, setPercentageCharge] = useState(0);
  const [fixCharge, setFixCharge] = useState(0);
  const [karmaOne, setKarmaOne] = useState(0);
  const [karmaTwo, setKarmaTwo] = useState(0);
  const [karmaThree, setKarmaThree] = useState(0);
  const [karmaFour, setKarmaFour] = useState(0);
  const [interestOne, setInterestOne] = useState(0);
  const [interestTwo, setInterestTwo] = useState(0);
  const [interestThree, setInterestThree] = useState(0);
  const [interestFour, setInterestFour] = useState(0);
  const [address, setAddress] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    getAssets();
  }, []);

  const getAssets = () => {
    Asset.getAll().then(res => {
      setAssets(res.data.data.assets)
    });
  }

  const openModal = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setEditModal(false);
  }

  const onFileChange = (e) => {
        const file = e.target.files[0];
        let formData = new FormData();
        formData.append('file', file);
        Upload.upload(formData).then(res => {
          setIcon(res.data.url);
        })
    }
    

  const handleSubmit = () => {
    let body = {
      asset:{
        name: name,
        icon: icon,
        full: full,
        min: min,
        max: max,
        conversion: conversion,
        percentageCharge: percentageCharge,
        fixCharge: fixCharge,
        address: address,
        karmaOne: karmaOne,
        karmaTwo: karmaTwo,
        karmaThree: karmaThree,
        karmaFour: karmaFour,
        interestOne: interestOne,
        interestTwo: interestTwo,
        interestThree: interestThree,
        interestFour: interestFour,
        stats: stats,
        walletAddress: walletAddress
      }
    }

    Asset.add(body).then(res => {
      getAssets();
      handleClose();
    });
  }

  const changeStatus = (id, status) => {
    let body = {
      status: status
    }
    Asset.status(id, body).then(res => {
      getAssets();
    });
  }

  const handleEdit = (index) => {
    setEditModal(true);
    setName(assets[index].name);
    setIcon(assets[index].icon);
    setFull(assets[index].full);
    setMin(assets[index].min);
    setMax(assets[index].max);
    setConversion(assets[index].conversion);
    setPercentageCharge(assets[index].percentageCharge);
    setFixCharge(assets[index].fixCharge);
    setAddress(assets[index].address);
    setSelectedIndex(index);
    setKarmaOne(assets[index].karmaOne);
    setKarmaTwo(assets[index].karmaTwo);
    setKarmaThree(assets[index].karmaThree);
    setKarmaFour(assets[index].karmaFour);
    setInterestOne(assets[index].interestOne);
    setInterestTwo(assets[index].interestTwo);
    setInterestThree(assets[index].interestThree);
    setInterestFour(assets[index].interestFour);
    setStats(assets[index].stats);
    setWalletAddress(assets[index].walletAddress);
  }

  const handleEditSubmit = () => {
    let body = {
      asset:{
        name: name,
        icon: icon,
        full: full,
        min: min,
        max: max,
        conversion: conversion,
        percentageCharge: percentageCharge,
        fixCharge: fixCharge,
        address: address,
        karmaOne: karmaOne,
        karmaTwo: karmaTwo,
        karmaThree: karmaThree,
        karmaFour: karmaFour,
        stats: stats,
        interestOne: interestOne,
        interestTwo: interestTwo,
        interestThree: interestThree,
        interestFour: interestFour,
        walletAddress: walletAddress
      }
    }
    Asset.update(assets[selectedIndex].id, body).then(res => {
      getAssets();
      handleClose();
    });
  }

  return (
    <>
      <div className="admin-dashboard">
        <div className="addAsset">
          <button className="btn btn-success" onClick={openModal}>
            <i class="fa-solid fa-plus"></i> Add Asset
          </button>
        </div>
        <table className="deposit-requests">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Symbol</th>
              <th>Min</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="deposit-requests__body">
            {assets.map((asset, index) => (
              <tr key={index}>
                <td>
                  <img src={environment.file_url + '/' + asset.icon} alt={asset.name} width="25px" />
                </td>
                <td>{asset.full}</td>
                <td>{asset.name}</td>
                <td>{asset.min}</td>
                <td>
                  <button className="btn btn-primary" onClick = {() => handleEdit(index)}>Edit</button>
                  {asset.status === 1 && <button className="btn btn-danger" onClick = {() => {changeStatus(asset.id ,2)}}>Disable</button> }
                  {asset.status === 2 && <button className="btn btn-success" onClick = {() => {changeStatus(asset.id ,1)}}>Enable</button> }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal open = {open} onClose={handleClose}>
              <div className="modal-main-lg">
                <div className="addAsset-modal">
                <div className="close" onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></div>
                  <form>
                  <div className="form-group">
                      <label htmlFor="assetIcon">Asset Icon</label>
                      <div className="inputFile">
                        <input type="file" className="form-control" id="assetIcon" placeholder="Asset Icon" onChange = {(e) => onFileChange(e)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetName">Asset Name</label>
                        <input type="text" className="form-control" id="assetName" placeholder="Asset Name" onChange={(e) => setFull(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetSymbol">Asset Symbol</label>
                      <input type="text" className="form-control" id="assetSymbol" placeholder="Asset Symbol" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Conversion Rate</label>
                        <input type="number" className="form-control" id="assetMin" placeholder="1USD=" onChange={(e) => setConversion(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Minimum Deposit</label>
                        <input type="number" className="form-control" id="assetMin" placeholder="Amount" onChange={(e) => setMin(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Maximum Deposit</label>
                        <input type="number" className="form-control" id="assetMin" placeholder="Amount" onChange={(e) => setMax(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Percentage Charge</label>
                        <input type="number" className="form-control" id="assetMin" placeholder="%" onChange={(e) => setPercentageCharge(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">EBankc Stats</label>
                        <input type="number" className="form-control" id="assetMin" placeholder="0" onChange={(e) => setStats(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Karma Level 1</label>
                        <input type="number" className="form-control" placeholder="%" onChange={(e) => setKarmaOne(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Karma Level 2</label>
                        <input type="number" className="form-control" placeholder="%" onChange={(e) => setKarmaTwo(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Karma Level 3</label>
                        <input type="number" className="form-control" placeholder="%" onChange={(e) => setKarmaThree(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Karma Level 4</label>
                        <input type="number" className="form-control" placeholder="%" onChange={(e) => setKarmaFour(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Interest Rate 1</label>
                        <input type="number" className="form-control" placeholder="%" onChange={(e) => setInterestOne(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Interest Rate 2</label>
                        <input type="number" className="form-control" placeholder="%" onChange={(e) => setInterestTwo(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Interest Rate 3</label>
                        <input type="number" className="form-control" placeholder="%" onChange={(e) => setInterestThree(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Interest Rate 4</label>
                        <input type="number" className="form-control" placeholder="%" onChange={(e) => setInterestFour(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Contract Address</label>
                        <input type="text" className="form-control" id="assetMin" value = {address} placeholder="Address" onChange={(e) => setAddress(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Deposit Wallet Address</label>
                        <input type="text" className="form-control" id="assetMin" value = {walletAddress} placeholder="Address" onChange={(e) => setWalletAddress(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Fix Charge</label>
                        <input type="number" className="form-control" id="assetMin" placeholder="0" onChange={(e) => setFixCharge(e.target.value)}/>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                  </form>
                </div>
              </div>
        </Modal>

        <Modal open = {editModal} onClose={handleClose}>
              <div className="modal-main-lg">
                <div className="addAsset-modal">
                <div className="close" onClick={handleClose}><i class="fa-solid fa-circle-xmark"></i></div>
                  <form>
                  <div className="form-group">
                      <label htmlFor="assetIcon">Asset Icon</label>
                      <div className="inputFile">
                        <input type="file" className="form-control" id="assetIcon" placeholder="Asset Icon" onChange = {(e) => onFileChange(e)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetName">Asset Name</label>
                        <input type="text" className="form-control" value = {full} id="assetName" placeholder="Asset Name" onChange={(e) => setFull(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetSymbol">Asset Symbol</label>
                      <input type="text" className="form-control" value = {name} id="assetSymbol" placeholder="Asset Symbol" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Conversion Rate</label>
                        <input type="number" className="form-control" id="assetMin" value = {conversion} placeholder="1USD=" onChange={(e) => setConversion(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Minimum Deposit</label>
                        <input type="number" className="form-control" id="assetMin" value = {min} placeholder="Amount" onChange={(e) => setMin(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Maximum Deposit</label>
                        <input type="number" className="form-control" id="assetMin" value = {max} placeholder="Amount" onChange={(e) => setMax(e.target.value)}/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="assetMin">Percentage Charge</label>
                        <input type="number" className="form-control" id="assetMin" value = {percentageCharge} placeholder="%" onChange={(e) => setPercentageCharge(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">EBankc Stats</label>
                        <input type="number" className="form-control" id="assetMin" value = {stats} placeholder="%" onChange={(e) => setStats(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Karma Level 1</label>
                        <input type="number" className="form-control" id="assetMin" value = {karmaOne} placeholder="%" onChange={(e) => setKarmaOne(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Karma Level 2</label>
                        <input type="number" className="form-control" id="assetMin" value = {karmaTwo} placeholder="%" onChange={(e) => setKarmaTwo(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Karma Level 3</label>
                        <input type="number" className="form-control" id="assetMin" value = {karmaThree} placeholder="%" onChange={(e) => setKarmaThree(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Karma Level 4</label>
                        <input type="number" className="form-control" id="assetMin" value = {karmaFour} placeholder="%" onChange={(e) => setKarmaFour(e.target.value)}/>
                    </div>
                    
                    <div className="form-group">
                    <label htmlFor="assetMin">Interest One</label>
                      <input type="number" className="form-control" id="assetMin" value = {interestOne} placeholder="%" onChange={(e) => setInterestOne(e.target.value)}/>
                    </div>

                  <div className="form-group">
                    <label htmlFor="assetMin">Interest Two</label>
                      <input type="number" className="form-control" id="assetMin" value = {interestTwo} placeholder="%" onChange={(e) => setInterestTwo(e.target.value)}/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="assetMin">Interest Three</label>
                      <input type="number" className="form-control" id="assetMin" value = {interestThree} placeholder="%" onChange={(e) => setInterestThree(e.target.value)}/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="assetMin">Interest Four</label>
                      <input type="number" className="form-control" id="assetMin" value = {interestFour} placeholder="%" onChange={(e) => setInterestFour(e.target.value)}/>
                  </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Contract Address</label>
                        <input type="text" className="form-control" id="assetMin" value = {address} placeholder="Address" onChange={(e) => setAddress(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Deposit Wallet Address</label>
                        <input type="text" className="form-control" id="assetMin" value = {walletAddress} placeholder="Address" onChange={(e) => setWalletAddress(e.target.value)}/>
                    </div>

                    <div className="form-group">
                      <label htmlFor="assetMin">Fix Charge</label>
                        <input type="number" className="form-control" id="assetMin" value = {fixCharge} placeholder="0" onChange={(e) => setFixCharge(e.target.value)}/>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleEditSubmit}>Update</button>
                  </form>
                </div>
              </div>
        </Modal>

      </div>
    </>
  );
}

export default Assets;

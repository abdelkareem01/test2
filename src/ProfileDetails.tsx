import React, {ChangeEvent, FormEvent, useState} from 'react';
import ScrollContainerHorizontal from "./ScrollContainerVertical";
import NameEditor from "./NameEditor";
import {useTonWallet} from "@tonconnect/ui-react";

let nick = "Guest";
let walletId = "";
let itemsList = ['Achievement 1', 'Achievement 2', 'Achievement 3', 'Achievement 4', 'Achievement 5']

const ProfileDetails = () => {

    const wallet = useTonWallet();

    const [isNameEditorOpen, setNameEditorOpen] = useState(false);
    const [name, setName] = useState<string>(nick);
    const [isCopied, setIsCopied] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    if (wallet !== null){
        walletId = wallet?.account.address;
    }

    // @ts-ignore
    const nickname = JSON.parse(localStorage.getItem('nickname'));
    if (nickname !== null){
        nick = nickname;
    }

    const handleClickCopy = () => {
        navigator.clipboard.writeText(walletId)
            .then(() => {
                console.log('Text successfully copied to clipboard');
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000); // Reset after 2s
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }

    const handleOpenNameEditor = () => {
        setNameEditorOpen(true);
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        if (inputValue !== name){
            setName(inputValue);
            localStorage.setItem('nickname',JSON.stringify(inputValue))
            setInputValue('');
            setNameEditorOpen(false);
        }
    };

    return (
            <div className="profileDetails">
                <div className="profile-pic-big"></div>
                <div className={"rows-container"}>
                    <div className={"profile-detail-style"}>
                        <div>
                            <p style={{
                                fontSize: "16px",
                                color: "white"
                            }}>{nick}</p>
                            <p style={{
                                marginTop: "8px"
                            }}>atakan@multiplayer.com.tr</p>
                        </div>
                        <div className={"profile-edit-verified"}>
                            <button className={"edit-button"} onClick={handleOpenNameEditor}>Edit</button>
                            <p className={"verified"}>Verified</p>
                        </div>
                    </div>
                    <div className={"wallet-address"}>
                        <text style={{
                            paddingLeft: "10px",
                            textAlign: "left",
                            display: "flex",
                            color: "grey"
                        }}>{walletId} </text>
                        <button onClick={handleClickCopy} className={"wallet-copy"}></button>
                    </div>
                    <div>
                        <h2 style={{
                            textAlign: "left",
                            fontSize: "16px",
                            color: "white"
                        }}>Badges</h2>
                        <div className={"badges-style"}>
                            <p className={"badges"}>Education</p>
                            <p className={"badges"}>Education</p>
                            <p className={"badges"}>Education</p>
                            <p className={"badges"}>Education</p>
                        </div>
                    </div>
                </div>
                <div className={"x-boost-text"}>
                    <text style={{
                        fontSize: "12px",
                        marginLeft: "8px",
                        paddingTop: "4px",
                        textAlign: "center",
                        display: "flex",
                        color: "white",
                }}>Great, your GamGam are boosting x1.5 MPs time more</text>
                </div>
                <div style={{
                    paddingLeft: 10,
                    gridArea: "third-row"
                }}>
                    <ScrollContainerHorizontal height={window.innerHeight/100*58} itemsList = {itemsList}></ScrollContainerHorizontal>
                </div>
                <NameEditor isOpen={isNameEditorOpen} close={() => setNameEditorOpen(false)}>
                    <p>You can change your name here.</p>
                    <p style={{
                        marginTop: 10
                    }}>
                        <input type="text"
                               value={inputValue}
                               onChange={handleInputChange}
                               placeholder="Enter new nickname"
                               style={{
                            height: 16,
                            resize: "none"
                        }}></input>
                    </p>
                    <button onClick={handleSubmit}>Change Name</button>
                </NameEditor>


            </div>
    );
};

export default ProfileDetails;
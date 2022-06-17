import React, {useRef, useState} from 'react';
import Header from "./MainComponents/Header";
import Aside from "./MainComponents/Aside";
import Main from "./MainComponents/Main";
import Footer from "./MainComponents/Footer";
import PopupArtist from "./MainComponents/PopupArtist";
export interface IPerformer {
    id: string,
    name: string,
    img: string,
    genre: string,
    followers: number
}

export interface IBestSound {
    img: string,
    name: string,
    url: string
}

function App() {
    const [performersList, setPerformersList] = useState<IPerformer[]>([
        {id: '0YC192cP3KPCRWx8zr8MfZ', name: "Hans Zimmer", img: "https://i.scdn.co/image/ab6761610000e5eb371632043a8c12bb7eeeaf9d", genre: 'german soundtrack', followers: 3005609},
        {id: '69v4ZOOomf1TNp59YYB1j7', name: "Noize MC", img: "https://i.scdn.co/image/ab6761610000e5ebecc26d01f8ede25e066f6a2e", genre: 'russian hip hop', followers: 1015821},
        {id: '6iQqWcDg92kre5ykFLwqD8', name: "Дайте танк (!)", img: "https://i.scdn.co/image/ab6761610000e5eb3c019c6bdfad108debf964c2", genre: 'russian indie', followers: 503444},
        {id: '0WjcdSKSTiNtfM4uQDIPDm', name: "Artists for Haiti", img: "https://i.scdn.co/image/ab67616d0000b273224e3de975885230a45ca8d4", genre: 'musical advocacy', followers: 3311},
        {id: '6eUKZXaKkcviH0Ku9w2n3V', name: "Ed Sheeran", img: "https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6", genre: 'pop', followers: 97937784},
        {id: '5IS4dQ9lDW01IY1buR7bW7', name: "СЕРЕГА ПИРАТ", img: "https://i.scdn.co/image/ab6761610000e5eb9dad1bf887f13a82c3a4d2d9", genre: 'russian drain', followers: 39862},
        {id: '3OQ8u3CgaqIydaf5ASMgT7', name: "Смех", img: "https://i.scdn.co/image/ab67616d0000b273096e39926fec68707dc78485", genre: 'russian pop punk', followers: 30195}
    ])

    const [artistInfo, setArtistInfo] = useState<IPerformer>({id: '0YC192cP3KPCRWx8zr8MfZ', name: "Hans Zimmer", img: "https://i.scdn.co/image/ab6761610000e5eb371632043a8c12bb7eeeaf9d", genre: 'german soundtrack', followers: 3005609})

    const [showPopup, setShowPopup] = useState(false)

    const [bestSoundOfArtist, setBestSound] = useState<IBestSound[]>([{img: '', name: '', url: ''}])

    const [currentPlayerLink, setCurrentPlayerLink] = useState<string>('https://p.scdn.co/mp3-preview/1477150a7e55da977b60801f29c7ab79c8d49b18?cid=6e3308bdbd0443aabfa1e7a312cb5a3e')

    const audioRef = useRef<HTMLAudioElement>(null)

  return (
    <div className="App">
        <Header ChangePerformers={setPerformersList}/>
        <Aside/>
        <Main performers={performersList}
              setArtistInfo={setArtistInfo}
              ShowPopup={setShowPopup}
              setBestSound={setBestSound}
        />
        <Footer playerLink={currentPlayerLink} audioRef={audioRef} />
        <PopupArtist artistInfo={artistInfo}
                     ShowArtist={setShowPopup}
                     bestSoundOfArtist={bestSoundOfArtist}
                     setTrackLink={setCurrentPlayerLink}
                     audioRef={audioRef}
                     popupVisible={showPopup}
        />

        <audio src={currentPlayerLink} ref={audioRef}></audio>
    </div>
  );
}

export default App;

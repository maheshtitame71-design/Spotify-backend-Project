const musicModel = require('../models/music.model')
const albumModel = require('../models/album.model')
const jwt = require('jsonwebtoken');
const { uploadFile } = require('../services/storage.service')


async function createMusic(req, res) {

  const title = req.body.title;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file provided' })
  }

  if (!title) {
    return res.status(400).json({ message: 'Title is required' })
  }

  const result = await uploadFile(file.buffer.toString('base64'))

  const music = await musicModel.create({
    uri: result.url,
    title,
    artist: req.user.id,
  })

  res.status(201).json({
    message: 'Music Created Successfully',
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    }
  })

}



async function createAlbum(req, res) {
  const { title, musics } = req.body;

  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musics,
  })

  res.status(201).json({
    message: "Album created Successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    }
  })
}


async function getAllMusics(req, res) {
  const musics = await musicModel.find().populate('artist', "username email")

  res.status(200).json({
    message: "Music fetched Successfully",
    musics: musics
  })
}


async function getAllAlbums(req, res) {
  const albums = await albumModel.find().populate('artist', "username email").populate({
    path: 'musics',
    populate: {
      path: 'artist',
      select: 'username email'
    }
  })

  res.status(200).json({
    message: "Albums fetched Successfully",
    albums: albums
  })
}


async function getAlbumById(req,res){

 const albumId = req.params.albumId;

 album = await albumModel.findById(albumId).populate('artist',"username email")

 return res.status(200).json({
  message:"album fetched Successfully",
  album:album,
 })

}




module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums , getAlbumById };


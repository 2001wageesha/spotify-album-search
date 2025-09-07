import React, { useState, useEffect } from 'react'; // <- important, includes useState and useEffect
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AlbumPage from './AlbumPage'; // make sure this file exists

// Spotify credentials
const CLIENT_ID = "f3ffecea2ce749d18638d6e8c48f8a9e";
const CLIENT_SECRET = "19d61817f3c44a05b712c9aca61056de";

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);

  // Get Spotify token on load
  useEffect(() => {
    const authparameter = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    };
    fetch('https://accounts.spotify.com/api/token', authparameter)
      .then(res => res.json())
      .then(data => setAccessToken(data.access_token));
  }, []);

  // Search artist
  async function search() {
    if (!searchInput) return;

    const searchParameters = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + accessToken }
    };

    const artistId = await fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=artist`, searchParameters)
      .then(res => res.json())
      .then(data => data.artists.items[0].id);

    const returnedAlbums = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US&limit=50`, searchParameters)
      .then(res => res.json())
      .then(data => setAlbums(data.items));
  }

  return (
    <Router>
      <Routes>
        {/* Main search page */}
        <Route
          path="/"
          element={
            <Container>
              <InputGroup className='mb-3' size='lg'>
                <FormControl
                  placeholder='Search For Artist'
                  type='input'
                  onKeyPress={event => { if (event.key === 'Enter') search(); }}
                  onChange={event => setSearchInput(event.target.value)}
                />
                <Button onClick={search}>Search</Button>
              </InputGroup>

              <Row className='mx-2 row row-cols-4 g-4'>
                {albums.map((album, i) => (
                  <Col key={i}>
                    <Link
                      to={`/album/${album.id}`}
                      state={{ album }}
                      style={{ textDecoration: 'none', color: 'black' }}
                    >
                      <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }}>
                        <div style={{ height: "250px", overflow: "hidden" }}>
                          <Card.Img src={album.images[0]?.url} />
                        </div>
                        <Card.Body>
                          <Card.Title>{album.name}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Container>
          }
        />

        {/* Album tracks page */}
        <Route path="/album/:id" element={<AlbumPage accessToken={accessToken} />} />
      </Routes>
    </Router>
  );
}

export default App;

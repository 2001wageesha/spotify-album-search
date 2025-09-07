import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function AlbumPage({ accessToken }) {
  const location = useLocation();
  const navigate = useNavigate();
  const album = location.state.album; // album info passed from Link
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function fetchTracks() {
      const searchParameters = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      };

      const data = await fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks`, searchParameters)
        .then(res => res.json());

      setTracks(data.items);
    }

    fetchTracks();
  }, [album.id, accessToken]);

  return (
    <Container className="mt-3">
      <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      <h2 className="mt-3">{album.name} Tracks</h2>
      <Row className="mt-3 row-cols-1 row-cols-md-3 g-4">
        {tracks.map((track, i) => (
          <Col key={i}>
            <Card className="h-100 shadow-sm">
              <div style={{ height: "150px", overflow: "hidden" }}>
                <Card.Img src={album.images[0].url} />
              </div>
              <Card.Body>
                <Card.Title>{track.name}</Card.Title>
                <Card.Text>Track Number: {track.track_number}</Card.Text>
                {track.preview_url ? (
                  <audio controls src={track.preview_url} style={{width: "100%"}}>
                    Your browser does not support the audio element.
                  </audio> ) :(
                    <div style={{color: '#aaa', fontStyle: 'italic'}}>No Preview Availbable</div>
                  )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Pembayaran Berhasil!',
      text: 'Terima kasih atas pembelian Anda. Kami akan segera memproses pesanan Anda.',
      confirmButtonText: 'Kembali ke Beranda'
    }).then(() => {
      navigate('/');
    });
  }, [navigate]);

  return (
    <Container className="mt-5">
      <Card className="text-center">
        <Card.Body>
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <Card.Title className="text-success">Pembayaran Berhasil!</Card.Title>
          <Card.Text>
            Terima kasih atas pembelian Anda. Session ID: {sessionId}
          </Card.Text>
          <Button variant="primary" onClick={() => navigate('/')}>
            Kembali ke Beranda
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentSuccessPage;
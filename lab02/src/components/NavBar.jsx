import { Container, Nav, Navbar } from 'react-bootstrap'
export default function NavBar() {
  return (
    <Navbar expand="md" className="atelier-nav">
      <Container>
        <Navbar.Brand href="#home">
          <span className="brand-mark">✳</span> Orchid Atelier
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#orchids">Collection</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

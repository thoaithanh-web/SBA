import NavBar from './components/NavBar'
import OrchidList from './components/OrchidList'
import Footer from './components/Footer'
export default function App() {
  return (
    <>
      <NavBar />
      <main id="home">
        <section className="hero container">
          <div>
            <p className="eyebrow">BOTANICAL STUDIES / LAB 01</p>
            <h1>
              A little closer
              <br />
              to <em>extraordinary.</em>
            </h1>
            <p className="hero-copy">
              Discover the quiet beauty of orchids. Eight blooms, each with a
              story of its own.
            </p>
            <a href="#orchids" className="btn btn-dark">
              Explore the collection ↗
            </a>
          </div>
          <div className="hero-art">
            <img
              src="/images/orchid-3.svg"
              alt="Illustration of a pink orchid"
            />
            <span>
              FIELD NOTES
              <br />
              <strong>No. 01</strong>
            </span>
          </div>
        </section>
        <OrchidList />
        <section id="about" className="container about">
          <p className="eyebrow">THE BOTANICAL NOTEBOOK</p>
          <h2>Small details. Lasting curiosity.</h2>
          <p>
            A React learning gallery by Lâm Thoại Thanh · CE190169 · SE1910.
            Original vector illustrations and illustrative orchid records,
            prepared for SBA301.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}

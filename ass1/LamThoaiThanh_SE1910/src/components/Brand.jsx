export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-symbol"><img src="/fu-news-logo.png" alt="" /></span>
      <span className="brand-name">FU<span>News</span><small>EDITORIAL WORKSPACE</small></span>
    </div>
  )
}

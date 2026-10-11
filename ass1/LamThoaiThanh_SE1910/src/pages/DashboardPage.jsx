import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileEdit,
  Layers3,
  Newspaper,
  Plus,
  Sparkles,
  Users,
} from 'lucide-react'
import { useNews } from '../context/NewsContext'
import PageHeading from '../components/PageHeading'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import { formatDate } from '../utils/format'

export default function DashboardPage() {
  const { data } = useNews()
  const published = data.news.filter((item) => item.status === 1).length
  const drafts = data.news.length - published
  const activeCategories = data.categories.filter((item) => item.status === 1).length
  const activeUsers = data.users.filter((item) => item.status === 1).length
  const recent = [...data.news]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 5)
  const categories = data.categories
    .map((item) => ({
      ...item,
      count: data.news.filter((article) => article.categoryId === item.id).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const stats = [
    {
      label: 'Total articles',
      value: data.news.length,
      detail: `${drafts} in draft`,
      icon: Newspaper,
    },
    {
      label: 'Published',
      value: published,
      detail: 'Stories shared with your campus',
      icon: CheckCircle2,
    },
    {
      label: 'Categories',
      value: data.categories.length,
      detail: `${activeCategories} active categories`,
      icon: Layers3,
    },
    {
      label: 'Contributors',
      value: data.users.length,
      detail: `${activeUsers} active accounts`,
      icon: Users,
    },
  ]

  return (
    <>
      <PageHeading
        title="Dashboard"
        description="A little overview of everything happening in your newsroom."
      >
        <Link to="/news?new=1" className="btn btn-primary">
          <Plus size={16} />
          New article
        </Link>
      </PageHeading>
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">
            {data.settings.publicationName.toUpperCase()} · EDITORIAL DESK
          </span>
          <h2>Good stories start with you.</h2>
          <p>
            {data.settings.tagline} You have {drafts} {drafts === 1 ? 'story' : 'stories'} in draft,
            ready for a little more inspiration.
          </p>
          <Link to="/news?status=0" className="text-link">
            Continue writing <ArrowRight size={14} />
          </Link>
        </div>
        <div className="banner-art" aria-hidden="true">
          <Newspaper size={78} strokeWidth={1.2} />
          <span>
            <Sparkles size={15} />
          </span>
        </div>
      </section>
      <div className="stats-grid">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div className="stat-top">
              <span>{label}</span>
              <span className="stat-icon">
                <Icon size={16} strokeWidth={1.6} />
              </span>
            </div>
            <div className="stat-number">{String(value).padStart(2, '0')}</div>
            <div className="stat-detail">{detail}</div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Recent stories</h2>
              <small>The latest from your editorial desk</small>
            </div>
            <Link to="/news" className="text-link">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>
          {recent.length ? (
            recent.map((article, index) => (
              <Link
                to={`/news?q=${encodeURIComponent(article.title)}`}
                className="article-row"
                key={article.id}
              >
                <span className={`article-tile tile-${index % 4}`}>
                  <Newspaper size={23} strokeWidth={1.25} />
                </span>
                <div className="article-summary">
                  <h3>{article.title}</h3>
                  <p>
                    {data.categories.find((item) => item.id === article.categoryId)?.name}{' '}
                    <span className="mx-1">·</span> {formatDate(article.updatedAt)}
                  </p>
                </div>
                <span className="article-status">
                  <StatusBadge status={article.status} article />
                </span>
              </Link>
            ))
          ) : (
            <EmptyState
              title="Your first story starts here"
              message="Create an article to bring your newsroom to life."
            >
              <Link to="/news?new=1" className="btn btn-primary">
                New article
              </Link>
            </EmptyState>
          )}
        </section>
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Stories by category</h2>
              <small>A snapshot of your content</small>
            </div>
            <Layers3 size={17} className="muted" />
          </div>
          <div className="category-overview">
            {categories.length ? (
              categories.map((category) => (
                <Link
                  className="category-meter d-block"
                  key={category.id}
                  to={`/news?category=${category.id}`}
                >
                  <div className="category-meter-label">
                    <span>{category.name}</span>
                    <strong>
                      {category.count} {category.count === 1 ? 'article' : 'articles'}
                    </strong>
                  </div>
                  <div className="meter-track">
                    <div
                      className="meter-fill"
                      style={{
                        width: `${data.news.length ? (category.count / data.news.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </Link>
              ))
            ) : (
              <p className="muted small">No categories yet.</p>
            )}
          </div>
          <div className="panel-note">
            <FileEdit size={13} className="me-2" />A balanced newsroom makes room for every voice.
          </div>
        </section>
      </div>
    </>
  )
}

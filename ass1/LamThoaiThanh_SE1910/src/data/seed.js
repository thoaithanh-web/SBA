export function createSeedData() {
  return {
    version: 1,
    settings: { publicationName: 'FU News', tagline: 'The campus, connected.' },
    categories: [
      { id: 'cat-1', name: 'Campus life', description: 'The people and moments that make our campus.', status: 1 },
      { id: 'cat-2', name: 'Academics', description: 'Learning, research and academic achievements.', status: 1 },
      { id: 'cat-3', name: 'Events', description: 'What is happening across the university.', status: 1 },
      { id: 'cat-4', name: 'Technology', description: 'New ideas, innovation and digital culture.', status: 1 },
      { id: 'cat-5', name: 'Student voices', description: 'Perspectives from our student community.', status: 1 },
      { id: 'cat-6', name: 'Alumni', description: 'Stories from our growing alumni network.', status: 0 },
    ],
    users: [
      { id: 'user-admin', username: 'Admin', name: 'Administrator', email: 'admin@example.edu', role: 1, status: 1 },
      { id: 'user-2', username: 'thanh.lam', name: 'Lâm Thoại Thanh', email: 'thanh.lam@example.edu', role: 2, status: 1 },
      { id: 'user-3', username: 'linh.nguyen', name: 'Nguyễn Khánh Linh', email: 'linh.nguyen@example.edu', role: 2, status: 1 },
      { id: 'user-4', username: 'minh.tran', name: 'Trần Quang Minh', email: 'minh.tran@example.edu', role: 2, status: 1 },
      { id: 'user-5', username: 'an.le', name: 'Lê Hoàng An', email: 'an.le@example.edu', role: 2, status: 0 },
    ],
    news: [
      { id: 'news-1', title: 'A new chapter for our campus community', content: 'Students and faculty came together to welcome a new semester, share their goals and reconnect with the campus community.\n\nStudent clubs introduced their activities, while the university team shared opportunities for learning, volunteering and collaboration. The gathering celebrated the everyday connections that make university life meaningful.', categoryId: 'cat-1', createdBy: 'user-2', status: 1, tags: ['community', 'campus'], createdAt: '2026-10-10T08:00:00+07:00', updatedAt: '2026-10-10T08:00:00+07:00' },
      { id: 'news-2', title: 'Student research takes the next step', content: 'This semester, student teams are turning classroom ideas into research projects. Faculty mentors will support proposal development, practical experiments and presentations.\n\nStudents interested in joining can contact their department for the programme schedule and application details.', categoryId: 'cat-2', createdBy: 'user-3', status: 1, tags: ['research', 'learning'], createdAt: '2026-10-09T14:30:00+07:00', updatedAt: '2026-10-09T14:30:00+07:00' },
      { id: 'news-3', title: 'The innovation showcase is almost here', content: 'Our annual innovation showcase will bring student projects, demonstrations and conversations to the campus.\n\nThe editorial team is collecting project stories and preparing the event guide. Final venue and registration details will be added before publication.', categoryId: 'cat-3', createdBy: 'user-4', status: 0, tags: ['showcase', 'innovation'], createdAt: '2026-10-08T10:00:00+07:00', updatedAt: '2026-10-08T10:00:00+07:00' },
      { id: 'news-4', title: 'Building useful things, one idea at a time', content: 'Student developers explored how small tools can solve real problems during a hands-on coding workshop. Teams practised breaking down requirements, reviewing their work and explaining design decisions.\n\nThe workshop highlighted how useful software begins with understanding the people who will use it.', categoryId: 'cat-4', createdBy: 'user-2', status: 1, tags: ['development', 'workshop'], createdAt: '2026-10-07T09:15:00+07:00', updatedAt: '2026-10-07T09:15:00+07:00' },
      { id: 'news-5', title: 'Finding your place beyond the classroom', content: 'University life is also about trying something new. Student clubs offer spaces to meet people, develop interests and contribute to the community.\n\nWe are inviting students to share a personal experience of joining a club for this upcoming feature.', categoryId: 'cat-5', createdBy: 'user-3', status: 0, tags: ['students', 'clubs'], createdAt: '2026-10-06T16:00:00+07:00', updatedAt: '2026-10-06T16:00:00+07:00' },
      { id: 'news-6', title: 'A weekend of volunteering and connection', content: 'Student volunteers worked together on a community activity over the weekend. Their efforts included planning, gathering resources and supporting local participants.\n\nThe team reflected on collaboration, responsibility and how small contributions can make a meaningful difference.', categoryId: 'cat-1', createdBy: 'user-4', status: 1, tags: ['volunteering'], createdAt: '2026-10-05T11:00:00+07:00', updatedAt: '2026-10-05T11:00:00+07:00' },
      { id: 'news-7', title: 'Meet the teams behind the next big idea', content: 'An interview series with student project teams is in preparation. Each conversation will explore a problem, a proposed solution and the lessons learned along the way.', categoryId: 'cat-4', createdBy: 'user-2', status: 0, tags: ['projects'], createdAt: '2026-10-04T13:00:00+07:00', updatedAt: '2026-10-04T13:00:00+07:00' },
      { id: 'news-8', title: 'Your guide to the campus open day', content: 'The newsroom is preparing a practical guide to campus open day. It will include programme introductions, student activities and useful information for visitors. Please check the final details with the organising team before publication.', categoryId: 'cat-3', createdBy: 'user-3', status: 0, tags: ['open-day'], createdAt: '2026-10-03T15:00:00+07:00', updatedAt: '2026-10-03T15:00:00+07:00' },
    ],
  }
}

# Assignment 02 requirements and interpretation

Author: Lam Thoai Thanh - CE190169 · SE1910.

Sources: Assignment 02 Implement CRUD Application with RESTful Web Service and ReactJS (5 pages) and SBA301 Assignments Interview Guide (4 pages), read in full on 29/10/2026. Source PDFs remain outside Git.

| Requirement | Planned implementation |
| --- | --- |
| Spring Boot 3 / SQL Server / Spring Data JPA | Backend with controller → service → repository; relational entity mapping |
| Project and DB A2StudentName_ClassCode | Both project folders A2LamThoaiThanh_SE1910; database A2LamThoaiThanh_SE1910 |
| React + Axios | Separate SPA with centralized Axios and real HTTP |
| Public active articles, no auth | Public list/detail filter active server-side |
| Email/password login | Session authentication; BCrypt password hashes; CSRF on writes |
| Admin=1 manages accounts | Server role checks, CRUD/search, protected delete rule |
| Staff=2 category/news/tags | CRUD/search, popup create/edit, confirm delete |
| Staff profile/history | Authenticated identity controls own profile and history; never trust submitted author ID |
| Category/account delete constraints | Service pre-checks and non-cascading database FKs |
| All fields typed/validated | Request DTO Bean Validation, rules and field errors |
| FE/BE interaction tested | API negative/positive tests, SQL persistence verification and browser workflows |

## SQL source decisions

The supplied SQL creates FUNewsManagementSBA301 but USE/ALTER point at FUNewsManagementFall2024. Both are replaced by the required A2LamThoaiThanh_SE1910 name. The existing slot22 database is not modified.

CategoryDesciption keeps the supplied spelling. Account and tag IDs remain non-identity as supplied; independent SQL sequences allocate new IDs starting at100 to avoid seeded keys. Category IDs stay identity.

Seed parent IDs equal their own category IDs. Normalize these roots to NULL. Parent cycles are rejected for writes.

The supplied script has ON DELETE CASCADE for article→category/account. Omit those cascades so HTTP rules and SQL integrity agree: referenced category/created-by account cannot be deleted. NewsTag rows are removed through the article association before deleting an article; reusable Tag rows remain.

The prose says a tag belongs to at most one article, but both the supplied NewsTag composite PK and seed data reuse tags across articles. Follow the executable supplied schema: ManyToMany through NewsTag, documented rather than silently dropping seed associations.

Staff may manage news as required; creation author is always the logged-in staff. Updating preserves creator and records updater. History is filtered by the authenticated creator. No extra owner-only restriction is invented for shared staff management.

Profile updates cannot change role or identity. Account role changes/logout invalidate the affected sessions. Avoid plaintext passwords in API responses/logs; provided classroom seed passwords are hashed once at backend startup. SQL server login password is local-only.

## Interview rubric

C1 understanding/design1.5; C2 actual development history/personal Git2.0; C3 working integration1.5; C4 explanation/trace/change impact5.0. Real implementation checkpoints are committed as they are completed, without backdating or manufactured history. AI help is disclosed; oral understanding and individual adaptation still require the student.

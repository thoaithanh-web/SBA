-- Author: Lam Thoai Thanh - CE190169
SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
GO
IF DB_ID(N'A2LamThoaiThanh_SE1910') IS NULL CREATE DATABASE A2LamThoaiThanh_SE1910;
GO
USE A2LamThoaiThanh_SE1910;
GO
IF OBJECT_ID('dbo.Category','U') IS NULL
CREATE TABLE dbo.Category(CategoryID SMALLINT IDENTITY PRIMARY KEY, CategoryName NVARCHAR(100) NOT NULL, CategoryDesciption NVARCHAR(250) NOT NULL, ParentCategoryID SMALLINT NULL, IsActive BIT NULL,
CONSTRAINT FK_A2_Category_Parent FOREIGN KEY(ParentCategoryID) REFERENCES dbo.Category(CategoryID));
GO
IF OBJECT_ID('dbo.SystemAccount','U') IS NULL
CREATE TABLE dbo.SystemAccount(AccountID SMALLINT PRIMARY KEY, AccountName NVARCHAR(100) NULL, AccountEmail NVARCHAR(70) NULL, AccountRole INT NULL, AccountPassword NVARCHAR(70) NULL);
GO
IF OBJECT_ID('dbo.Tag','U') IS NULL
CREATE TABLE dbo.Tag(TagID INT PRIMARY KEY, TagName NVARCHAR(50) NULL, Note NVARCHAR(400) NULL);
GO
IF OBJECT_ID('dbo.NewsArticle','U') IS NULL
CREATE TABLE dbo.NewsArticle(NewsArticleID NVARCHAR(20) PRIMARY KEY, NewsTitle NVARCHAR(400) NULL, Headline NVARCHAR(150) NOT NULL, CreatedDate DATETIME NULL, NewsContent NVARCHAR(4000) NULL, NewsSource NVARCHAR(400) NULL, CategoryID SMALLINT NULL, NewsStatus BIT NULL, CreatedByID SMALLINT NULL, UpdatedByID SMALLINT NULL, ModifiedDate DATETIME NULL,
CONSTRAINT FK_A2_News_Category FOREIGN KEY(CategoryID) REFERENCES dbo.Category(CategoryID),
CONSTRAINT FK_A2_News_Creator FOREIGN KEY(CreatedByID) REFERENCES dbo.SystemAccount(AccountID),
CONSTRAINT FK_A2_News_Updater FOREIGN KEY(UpdatedByID) REFERENCES dbo.SystemAccount(AccountID));
GO
IF OBJECT_ID('dbo.NewsTag','U') IS NULL
CREATE TABLE dbo.NewsTag(NewsArticleID NVARCHAR(20) NOT NULL, TagID INT NOT NULL, PRIMARY KEY(NewsArticleID,TagID),
CONSTRAINT FK_A2_NewsTag_News FOREIGN KEY(NewsArticleID) REFERENCES dbo.NewsArticle(NewsArticleID),
CONSTRAINT FK_A2_NewsTag_Tag FOREIGN KEY(TagID) REFERENCES dbo.Tag(TagID));
GO
IF NOT EXISTS(SELECT 1 FROM sys.sequences WHERE name='AccountSequence') EXEC('CREATE SEQUENCE dbo.AccountSequence AS INT START WITH 100 INCREMENT BY 1');
IF NOT EXISTS(SELECT 1 FROM sys.sequences WHERE name='TagSequence') EXEC('CREATE SEQUENCE dbo.TagSequence AS INT START WITH 100 INCREMENT BY 1');
GO
SET IDENTITY_INSERT dbo.Category ON;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Category WHERE CategoryID = 1)
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (1, N'Academic news', N'This category can include articles about research findings, faculty appointments and promotions, and other academic-related announcements.', NULL, 1);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Category WHERE CategoryID = 2)
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (2, N'Student Affairs', N'This category can include articles about student activities, events, and initiatives, such as student clubs, organizations and sports.', NULL, 1);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Category WHERE CategoryID = 3)
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (3, N'Campus Safety', N'This category can include articles about incidents and safety measures implemented on campus to ensure the safety of students and faculty.', NULL, 1);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Category WHERE CategoryID = 4)
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (4, N'Alumni News', N'This category can include articles about the achievements and accomplishments of former students and alumni, such as graduations, job promotions and career successes.', NULL, 1);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Category WHERE CategoryID = 5)
INSERT [dbo].[Category] ([CategoryID], [CategoryName], [CategoryDesciption], [ParentCategoryID], [IsActive]) VALUES (5, N'Capstone Project News', N'This category is typically a comprehensive and detailed report created as part of an academic or professional capstone project. ', NULL, 0);
GO
SET IDENTITY_INSERT dbo.Category OFF;
GO
IF NOT EXISTS (SELECT 1 FROM dbo.SystemAccount WHERE AccountID = 1)
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (1, N'Emma William', N'EmmaWilliam@FUNewsManagement.org', 2, N'@1');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.SystemAccount WHERE AccountID = 2)
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (2, N'Olivia James', N'OliviaJames@FUNewsManagement.org', 2, N'@1');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.SystemAccount WHERE AccountID = 3)
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (3, N'Isabella David', N'IsabellaDavid@FUNewsManagement.org', 2, N'@1');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.SystemAccount WHERE AccountID = 4)
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (4, N'Michael Charlotte', N'MichaelCharlotte@FUNewsManagement.org', 2, N'@1');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.SystemAccount WHERE AccountID = 5)
INSERT [dbo].[SystemAccount] ([AccountID], [AccountName], [AccountEmail], [AccountRole], [AccountPassword]) VALUES (5, N'Steve Paris', N'SteveParis@FUNewsManagement.org', 1, N'@1');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Tag WHERE TagID = 1)
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (1, N'Education', N'Education Note');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Tag WHERE TagID = 2)
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (2, N'Technology', N'Technology Note');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Tag WHERE TagID = 3)
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (3, N'Research', N'Research Note');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Tag WHERE TagID = 4)
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (4, N'Innovation', N'Innovation Note');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Tag WHERE TagID = 5)
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (5, N'Campus Life', N'Campus Life Note');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Tag WHERE TagID = 6)
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (6, N'Faculty', N'Faculty Achievements');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Tag WHERE TagID = 7)
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (7, N'Alumni ', N'Alumni News');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Tag WHERE TagID = 8)
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (8, N'Events', N'University Events');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.Tag WHERE TagID = 9)
INSERT [dbo].[Tag] ([TagID], [TagName], [Note]) VALUES (9, N'Resources', N'Campus Resources');
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsArticle WHERE NewsArticleID = N'1')
INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'1', N'University FU Celebrates Success of Alumni in Various Fields', N'University FU Celebrates Success of Alumni in Various Fields', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'University FU recently commemorated the achievements of its esteemed alumni who have excelled in a multitude of fields, showcasing the impact of the institution''s education on their professional journeys.

Diverse Success Stories: From successful entrepreneurs to renowned artists, University X''s alumni have made significant strides in various industries, reflecting the versatility of the education provided.

Networking Opportunities: The university''s strong alumni network played a crucial role in fostering connections and collaborations among graduates, contributing to their success.

Alumni Contributions: Many alumni have also given back to the university through mentorship programs, scholarships, and guest lectures, enriching the current student experience.', N'N/A', 4, 1, 1, 1, CAST(N'2024-05-05T00:00:00.000' AS DateTime));
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsArticle WHERE NewsArticleID = N'2')
INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'2', N'Alumni Association Launches Mentorship Program for Recent Graduates', N'Alumni Association Launches Mentorship Program for Recent Graduates', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'The Alumni Association of University FU recently unveiled a new mentorship program aimed at providing support and guidance to recent graduates as they navigate the transition from academia to the professional world.

The program pairs recent graduates with experienced alumni mentors based on their career interests and goals, ensuring tailored guidance for each mentee.

In addition to one-on-one mentorship, the program offers workshops on resume building, interview preparation, and networking strategies to equip graduates with essential skills for success.

The mentorship program also facilitates networking events where mentees can expand their professional connections and learn from alumni who have excelled in their respective fields.

By fostering a supportive network of alumni mentors, the program aims to empower recent graduates to navigate the challenges of the job market, enhance their professional growth, and build lasting connections within their industries.

The launch of this mentorship program by the Alumni Association of University Y underscores the commitment to nurturing the success of its graduates beyond graduation, creating a strong community of support and guidance for the next generation of professionals.', N'Internet', 4, 1, 1, 1, CAST(N'2024-05-05T00:00:00.000' AS DateTime));
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsArticle WHERE NewsArticleID = N'3')
INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'3', N'Academic Department Announces Groundbreaking Initiatives and Program Enhancements', N'Academic Department Announces Groundbreaking Initiatives and Program Enhancements', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'The Software Engineering Department at FU has unveiled a series of transformative initiatives and program enhancements aimed at enriching the academic experience and fostering innovation in Software Development.

The department has established [specific research centers or facilities] dedicated to advancing knowledge and addressing pressing challenges in Software Development.

Faculty Promotions: Several esteemed faculty members have been promoted to key leadership positions, reflecting their commitment to academic excellence and their vision for shaping the future of Software Development.

The academic programs within the department have undergone enhancements to incorporate the latest developments and equip students with practical skills and knowledge relevant to current industry demands.

These initiatives are poised to position the Software Engineering Department as a hub of innovation and academic rigor, attracting top talent and fostering groundbreaking research and learning experiences.
', N'N/A', 1, 1, 2, 2, CAST(N'2024-05-05T00:00:00.000' AS DateTime));
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsArticle WHERE NewsArticleID = N'4')
INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'4', N'Renowned Scholar Appointed as Head of AI Department at FU', N'Renowned Scholar Appointed as Head of AI Department at FU', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'FU proudly announces the appointment of David Nitzevet, a distinguished scholar in Machine Learning, to the prestigious position of Head of AI Department, underscoring the institution''s commitment to academic excellence and leadership.

David Nitzevet brings a wealth of experience and expertise to the role, with a notable track record of the development of deep learning algorithms and the application of machine learning in healthcare, finance, and marketing. In accepting the appointment, David Nitzevet expressed a vision to develop new algorithmic models, improve data preprocessing techniques, and enhance the interpretability of machine learning models, align with the university''s mission to drive innovation and excellence in Machine Learning.

The appointment is expected to foster collaborations and initiatives that will enrich the academic and research landscape of the university and beyond.

The addition of David Nitzevet to the AI Department faculty elevates the institution''s academic standing and promises to inspire students, scholars, and professionals in Machine Learning. The appointment reaffirms the university''s dedication to recruiting top-tier talent and nurturing an environment where academic distinction thrives.
', N'N/A', 1, 1, 2, 2, CAST(N'2024-05-05T00:00:00.000' AS DateTime));
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsArticle WHERE NewsArticleID = N'5')
INSERT [dbo].[NewsArticle] ([NewsArticleID], [NewsTitle], [Headline], [CreatedDate], [NewsContent], [NewsSource], [CategoryID], [NewsStatus], [CreatedByID], [UpdatedByID], [ModifiedDate]) VALUES (N'5', N'New Research Findings Shed Light on STEM', N'New Research Findings Shed Light on STEM', CAST(N'2024-05-05T00:00:00.000' AS DateTime), N'Groundbreaking research conducted by the Research Department of FU has unveiled significant findings in the field of STEM, offering fresh insights that could revolutionize current understanding and practices.

The success of this research is attributed to the collaborative efforts of a multidisciplinary team, showcasing the institution''s commitment to fostering cutting-edge research. The newly uncovered knowledge has the potential to influence Math, Engineering, Technology and shape future research endeavors, positioning the Research Department of FU as a leader in the advancement of STEM.

The research findings stand as a testament to the institution''s dedication to impactful research and its contribution to the global knowledge base in STEM.', N'N/A', 1, 1, 2, 2, CAST(N'2024-05-05T00:00:00.000' AS DateTime));
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'1' AND TagID = 5)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'1', 5);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'1' AND TagID = 7)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'1', 7);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'1' AND TagID = 9)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'1', 9);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'2' AND TagID = 5)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'2', 5);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'2' AND TagID = 7)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'2', 7);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'2' AND TagID = 8)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'2', 8);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'2' AND TagID = 9)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'2', 9);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'3' AND TagID = 1)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'3', 1);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'3' AND TagID = 8)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'3', 8);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'3' AND TagID = 9)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'3', 9);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'4' AND TagID = 1)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'4', 1);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'4' AND TagID = 4)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'4', 4);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'4' AND TagID = 8)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'4', 8);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'4' AND TagID = 9)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'4', 9);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'5' AND TagID = 2)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'5', 2);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'5' AND TagID = 3)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'5', 3);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'5' AND TagID = 4)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'5', 4);
GO
IF NOT EXISTS (SELECT 1 FROM dbo.NewsTag WHERE NewsArticleID = N'5' AND TagID = 6)
INSERT [dbo].[NewsTag] ([NewsArticleID], [TagID]) VALUES (N'5', 6);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_A2_AccountEmail') CREATE UNIQUE INDEX UX_A2_AccountEmail ON dbo.SystemAccount(AccountEmail) WHERE AccountEmail IS NOT NULL;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_A2_CategoryName') CREATE UNIQUE INDEX UX_A2_CategoryName ON dbo.Category(CategoryName);
GO

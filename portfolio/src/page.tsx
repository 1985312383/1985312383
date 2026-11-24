import { CopyCommand } from "./copy-command";
import { conference2022, education, githubProfile, otherProjects, patents, publicationDoi, publicationTitle, roles } from "./content";
import { Header, LocationBar } from "./navigation";
import { ProjectExplorer } from "./project-explorer";
import { MovieRecall } from "./recall/movie-recall";
import { Icon } from "./icons";

const stars = [
  [9, 20, "dot"], [22, 12, "diamond"], [32, 26, "dot"], [46, 10, "dot"],
  [68, 14, "cross"], [86, 9, "dot"], [95, 31, "dot"], [7, 51, "dot"],
  [23, 43, "dot"], [4, 72, "cross"], [14, 84, "dot"], [79, 89, "diamond"],
  [95, 73, "cross"], [89, 84, "dot"], [60, 93, "dot"], [32, 84, "dot"],
] as const;

function OrbitalIllustration() {
  return <div className="hero-art">
    <div className="sky-specks" aria-hidden="true">{stars.map(([x, y, kind]) =>
      <i key={x + "-" + y} className={"speck " + kind} style={{ left: x + "%", top: y + "%" }} />)}</div>
    <div className="orbit-drawing">
      <img src="./images/terminal-orbit.webp" className="planet" alt="一台像素终端站在黄色星球上，卫星沿轨道运行。" fetchPriority="high" width="1040" height="979" />
      <div className="speech" aria-hidden="true"><span>&gt;&gt;&gt;</span> import torch_rechub<i /></div>
      <a className="orbit-tag tag-project" href="#torch-rechub"><Icon name="layers" size={13} />Torch-RecHub</a>
      <a className="orbit-tag tag-tutorial" href="#easy-vecdb"><Icon name="book" size={13} />easy-vecdb</a>
    </div>
  </div>;
}

function Education() {
  return <section className="frame page-section education-section" id="education" aria-labelledby="education-title">
    <span className="anchor-alias" id="about" />
    <div className="section-heading">
      <div className="section-label"><Icon name="school" size={17} /><span>~/education</span></div>
      <h2 id="education-title">教育背景<span className="ink-dot">.</span></h2>
    </div>
    <div className="education-grid">{education.map(item => <article className="school-entry" key={item.school}>
      <div className="school-meta"><span className="degree">{item.degree}</span><span className="period">{item.period}</span></div>
      <h3>{item.school}</h3><p className="school-major">{item.major}</p>
      <p className="school-english" lang="en">{item.english}</p>
      <a className="school-research plain-link" href={item.href}>{item.research}</a>
    </article>)}</div>
  </section>;
}

function Experience() {
  return <section className="frame page-section experience-section" id="experience" aria-labelledby="experience-title">
    <div className="section-heading">
      <div className="section-label"><Icon name="case" size={16} /><span>~/experience</span></div>
      <h2 id="experience-title">工作经历<span className="ink-dot">.</span></h2>
    </div>
    <div className="roles">{roles.map(job => <article id={job.id} className="role-entry" key={job.id}>
      <div className="role-meta"><span className="period">{job.period}</span><h3>{job.employer}</h3></div>
      <div className="role-focus"><strong>{job.role}</strong><p className="body-copy">{job.focus}</p></div>
    </article>)}</div>
  </section>;
}

function Projects() {
  return <section className="frame page-section" id="work" aria-labelledby="work-title">
    <div className="section-heading">
      <div className="section-label"><Icon name="folder" size={16} /><span>~/open-source</span></div>
      <h2 id="work-title">开源项目<span className="ink-dot">.</span></h2>
    </div>
    <article id="torch-rechub" aria-labelledby="torch-title" className="torch-feature">
      <ProjectExplorer>
        <header className="torch-heading">
          <h3 id="torch-title" lang="en">Torch-RecHub</h3>
          <p><strong>项目负责人</strong><span>2024.01 至今</span></p>
        </header>
        <p className="torch-summary body-copy">负责 Datawhale 推荐算法框架的整体开发与维护，涵盖召回、排序、多任务和生成式推荐。框架提供统一的训练与评测流程，也支持向量检索、模型导出和跨硬件训练。</p>
      </ProjectExplorer>
      <MovieRecall />
    </article>
    <div className="other-projects">
      {otherProjects.map(project => <article key={project.id} id={project.id} className="other-project">
        <div className="other-project-heading">
          <h3><a href={project.repo} target="_blank" rel="noreferrer">{project.title}</a></h3>
          <span className="project-role">{project.role}</span>
        </div>
        <p className="body-copy">{project.description}</p>
        <div className="reading-links">{project.links.map(link =>
          <a key={link.href} className="plain-link" href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}</div>
      </article>)}
    </div>
  </section>;
}

function Research() {
  return <section className="frame page-section research-section" id="research" aria-labelledby="research-title">
    <div className="section-heading">
      <div className="section-label"><Icon name="book" size={16} /><span>~/research</span></div>
      <h2 id="research-title">论文与专利<span className="ink-dot">.</span></h2>
      <p>硕士阶段研究光子计数 CT，第一作者成果包括 1 篇期刊论文和 2 篇 IEEE 会议论文。</p>
    </div>
    <article className="paper" id="paper-trpms">
      <div className="paper-meta"><span className="degree">期刊论文</span><span className="period">2025</span></div>
      <div className="paper-content">
        <p className="paper-venue" lang="en">IEEE Transactions on Radiation and Plasma Medical Sciences</p>
        <h3 lang="en"><a href={"https://doi.org/" + publicationDoi} target="_blank" rel="noreferrer">{publicationTitle}</a></h3>
        <p className="paper-authors"><strong>Tao Fan</strong> 等</p>
        <div className="paper-links"><a className="plain-link doi" href={"https://doi.org/" + publicationDoi} target="_blank" rel="noreferrer">DOI {publicationDoi}</a><a className="plain-link" href="https://clinic.shanghaitech.edu.cn/research/progress/117" target="_blank" rel="noreferrer">学校研究报道</a></div>
      </div>
    </article>
    <article className="paper" id="paper-nss-2022">
      <div className="paper-meta"><span className="degree">会议论文</span><span className="period">2022</span></div>
      <div className="paper-content">
        <p className="paper-venue">IEEE NSS/MIC/RTSD · 米兰</p>
        <h3 lang="en">{conference2022.title}</h3>
        <p className="paper-authors"><strong>Fan, T.</strong>, et al.</p>
        <a className="plain-link" href={conference2022.citationUrl} target="_blank" rel="noreferrer">引文记录（Radiology 参考文献 31）</a>
      </div>
    </article>
    <div className="patents-heading"><h3>专利文献</h3><a className="plain-link" href="http://epub.cnipa.gov.cn/" target="_blank" rel="noreferrer">国家知识产权局公报查询</a></div>
    <div className="patent-table">
      <div className="patent-columns" aria-hidden="true"><span>公布 / 公告日</span><span>专利名称与文献号</span><span>文献类型与署名</span></div>
      <ul className="patent-list">{patents.map(item => <li key={item.number} id={"patent-" + item.number}>
        <time dateTime={item.date}>{item.date}</time>
        <div className="patent-name"><a href={item.href} target="_blank" rel="noreferrer">{item.topic}</a><span><code>{item.number}</code><small>{item.organization}</small></span></div>
        <div className="patent-credit"><strong>{item.kind}</strong><small>{item.credit}</small></div>
      </li>)}</ul>
    </div>
  </section>;
}

export default function Home({ year }: { year: number }) {
  return <>
    <a className="skip-link" href="#main">跳到主要内容</a><Header />
    <main id="main">
      <section className="frame hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="greeting"><span className="shell-prompt" aria-hidden="true">›_</span><strong>范涛</strong><span className="name-divider">/</span><span lang="en">Tao Fan</span></p>
          <h1 id="hero-title"><span><em>推荐算法</em>，</span><span>从召回到部署。</span></h1>
          <p className="hero-intro">上海科技大学计算机科学与技术硕士，<strong>Torch-RecHub</strong> 项目负责人。开发推荐模型和训练工具，也为不同硬件适配训练流程，编写向量检索教程。</p>
          <div className="hero-actions"><a href="#work" className="button-sun"><Icon name="folder" size={17} />浏览开源项目</a><CopyCommand /></div>
        </div>
        <OrbitalIllustration />
      </section>
      <div className="frame ruler" aria-hidden="true" />
      <Education /><Experience /><Projects /><Research />
    </main>
    <footer className="site-footer frame"><span>© {year} 范涛 · 柯慕灵</span><div><a href={githubProfile} target="_blank" rel="noreferrer"><Icon name="github" size={16} />GitHub</a><a href="#top">回到顶部</a></div></footer>
    <LocationBar />
  </>;
}

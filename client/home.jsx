const React = require('react');
const { createRoot } = require('react-dom/client');
const { useState, useEffect } = React;
const { motion, AnimatePresence } = require('framer-motion');
const { FontAwesomeIcon } = require('@fortawesome/react-fontawesome');
const { faGithub, faLinkedinIn, faSoundcloud } = require('@fortawesome/free-brands-svg-icons');
const { faPlay, faX } = require('@fortawesome/free-solid-svg-icons');
const { HorizontalReveal, VerticalReveal, StaticReveal, Fade } = require('./components/revealComp.js');
const { AudioPlayer } = require('./components/audioComp.js');
const backendHelper = require('./backendHelper.js');

const { initializeEffect } = require('./typewriter.js');

const About = () => 
{
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
    const [playedAnimation, setPlayedAnimation] = useState(false);

    useEffect(() => {
        // Initialize the typing effect
        initializeEffect();

        const handleResize = () => {
            const isCurrentlyMobileView = window.innerWidth <= 768;
            setIsMobileView(isCurrentlyMobileView);

            // Reset animation if moving into mobile view for the first time
            if(isCurrentlyMobileView && !playedAnimation) {
                setPlayedAnimation(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [playedAnimation])

    return (
        <motion.div id='about-section'>
            <motion.div id="about-content">
                <HorizontalReveal id='about-text' direction='left'>
                    <motion.div id='about-text-content'>
                        <motion.h1>VINCENT LE</motion.h1>
                        <motion.h2 id='typewriter-header'>GAMEPLAY PROGRAMMER</motion.h2>
                        <motion.div id='icons'>
                            <motion.div className='icon-container'
                            onClick={() => {window.open("https://github.com/Le-Vincent56/", "_blank")}}
                            >
                                <FontAwesomeIcon icon={faGithub} className='icon'/>
                            </motion.div>
                            <motion.div className='icon-container'
                            onClick={() => {window.open("https://www.linkedin.com/in/vincent-le-67266521b/", "_blank")}}
                            >
                                <FontAwesomeIcon icon={faLinkedinIn} className='icon'/>
                            </motion.div>
                            <motion.div className='icon-container'
                            onClick={() => {window.open("https://soundcloud.com/user-643888929", "_blank")}}
                            >
                                <FontAwesomeIcon icon={faSoundcloud} className='icon'/>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </HorizontalReveal>

                {!playedAnimation ? ( 
                    isMobileView ? (
                        <HorizontalReveal id='about-vertical-line' direction='right' delay={0.5}
                        onAnimationComplete={() => setPlayedAnimation(true)}/>
                    ) : (
                        <VerticalReveal id='about-vertical-line' direction='down' delay={0.5}
                        onAnimationComplete={() => setPlayedAnimation(true)}/>
                    )
                ) : (
                    <motion.div id="about-vertical-line" style={{ opacity: 1, transition: "none" }} />
                )}
                
                <VerticalReveal id='about-image' direction='up' delay={1}>
                    <motion.img src="assets/img/About.jpg" alt="Vincent Le"/>
                </VerticalReveal>
            </motion.div>
        </motion.div>
    )
}

const Projects = () => {
    const [activeTab, setActiveTab] = useState(0);
    const handleNavClick = (tabIndex) => {
        setActiveTab(tabIndex)
    }

    return (
        <motion.div id='projects'>
            <VerticalReveal id='projects-header' direction="up">
                <motion.div id='projects-header-text'>
                    <motion.h1>PROJECTS</motion.h1>
                </motion.div>
                <motion.div id='projects-header-navigation'>
                    <motion.div 
                    className={`nav-button ${activeTab === 0 ? 'selected' : ''}`}
                    onClick={() => handleNavClick(0)}
                    >
                        <motion.h2>GAMES</motion.h2>
                    </motion.div>
                    <motion.div
                    className={`nav-button ${activeTab === 1 ? 'selected' : ''}`}
                    onClick={() => handleNavClick(1)}
                    >
                        <motion.h2>AUDIO</motion.h2>
                    </motion.div>
                    <motion.div
                    className={`nav-button ${activeTab === 2 ? 'selected' : ''}`}
                    onClick={() => handleNavClick(2)}
                    >
                        <motion.h2>WRITING</motion.h2>
                    </motion.div>
                </motion.div>
            </VerticalReveal>
            <motion.div id='projects-content'>
                <AnimatePresence mode="wait">
                    {activeTab === 0 && (
                        <motion.div
                            key="coding"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <CodeProjects />
                        </motion.div>
                    )}
                    {activeTab === 1 && (
                        <motion.div
                            key="audio"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <AudioProjects />
                        </motion.div>
                    )}
                    {activeTab === 2 && (
                        <motion.div
                            key="writing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <WritingProjects />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    )
}

const CodeProjects = () => {
    const [projects, setProjects] = useState([]);

    // Load the Code projects in from the server
    useEffect(() => {
        const loadProjectsFromServer = async () => {
            const response = await fetch(`/getCodeProjects`);
            const data = await response.json();
            setProjects(data.projects);
        };
        loadProjectsFromServer();
    }, []);

    const readProject = async (e, projectTitle, projectID) => {
        backendHelper.sendGet(`/getCodePage?title=${projectTitle}&id=${projectID}`)
    }

    // Present the appropriate HTML if no projects are loaded
    if(projects.length === 0) {
        return (
            <motion.div id='code-projects'>
                <motion.h1 id='empty-code-projects'>No Code Projects Yet!</motion.h1>
            </motion.div>
        );
    }

    // Create a node for each project
    const projectNodes = projects.map(project => {

        // Create the role string
        let roleString = project.roles.join(', ');

        return (
            <StaticReveal id={project.id} className='code-project-node' list={false}
            onClick={(e) => readProject(e, project.title, project.id)}>
                <motion.div className='code-project-node-background' onClick={(e) => readProject(e, project.title, project.id)}>
                    <motion.img src={`assets/img/code/${project.imageURL}`} className='code-project-image'/>
                    <motion.div className='code-project-overlay'/>
                </motion.div>
                <motion.div className='code-project-node-info' onClick={(e) => readProject(e, project.title, project.id)}>
                    <motion.h1 className='code-project-node-title'>{project.title}</motion.h1>
                    <motion.h2 className='code-project-node-roles'>{roleString}</motion.h2>
                </motion.div>
            </StaticReveal>
        )
    });

    return (
        <StaticReveal id='code-projects' list={true}>
            {projectNodes}
        </StaticReveal>
    );
}

const AudioProjects = () => {
    const [projects, setProjects] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [currentTitle, setCurrentTitle] = useState(null);
    const [currentImageURL, setCurrentImageURL] = useState(null);
    const [isPlayerVisible, setPlayerVisible] = useState(false);

    // Load the Code projects in from the server
    useEffect(() => {
        const loadProjectsFromServer = async () => {
            const response = await fetch(`/getAudioProjects`);
            const data = await response.json();
            setProjects(data.projects);
        };
        loadProjectsFromServer();
    }, []);

    const handleCardClick = (track, title, imageURL) => {
        setCurrentTrack(`assets/audio/${track}`);
        setCurrentTitle(title);
        setCurrentImageURL(`assets/img/audio/${imageURL}`);
        setPlayerVisible(true);
    };

    // Present the appropriate HTML if no projects are loaded
    if(projects.length === 0) {
        return (
            <motion.div id='audio-projects'>
                <motion.h1 id='empty-audio-projects'>No Audio Projects Yet!</motion.h1>
            </motion.div>
        );
    }

    // Create a node for each project
    const projectNodes = projects.map(project => {
        return (
            <StaticReveal id={project.id} className='audio-project-node' list={false}>
                <motion.div className='audio-project-node-thumbnail'>
                    <motion.img src={`assets/img/audio/${project.imageURL}`} className='audio-project-image'/>
                    <motion.div className='audio-project-node-overlay'>
                        <motion.div className='audio-project-node-play-btn'
                        onClick={() => handleCardClick(project.trackURL, project.title, project.imageURL)}>
                            <FontAwesomeIcon icon={faPlay} className='audio-play-icon'/>
                        </motion.div>
                    </motion.div>
                </motion.div>
                <motion.div className='audio-project-node-info'>
                    <motion.h1 className='audio-project-node-title'>{project.title}</motion.h1>
                </motion.div>
            </StaticReveal>
        )
    });

    return (
        <StaticReveal id='audio-projects' list={true}>
            <motion.div id='audio-projects-list'>
                {projectNodes}
            </motion.div>
            {isPlayerVisible && 
            <AudioPlayer track={currentTrack} isPlayerVisible={isPlayerVisible}
            trackTitle={currentTitle} trackAuthor="Vincent Le" imageURL={currentImageURL}
            />}
        </StaticReveal>
    );
}

const WritingProjectsList = ({ onClick }) => {
    const [projects, setProjects] = useState([]);

    // Load the Writing projects in from the server
    useEffect(() => {
        const loadProjectsFromServer = async () => {
            const response = await fetch(`/getWritingProjects`);
            const data = await response.json();
            setProjects(data.projects);
        };
        loadProjectsFromServer();
    }, []);

    // Present the appropriate HTML if no projects are loaded
    if(projects.length === 0) {
        return (
            <motion.div id='writing-projects'>
                <motion.h1 id='empty-writing-projects'>No Writing Projects Yet!</motion.h1>
            </motion.div>
        );
    }

    // Create a node for each project
    const projectNodes = projects.map(project => {

        // Create the role string
        let genreString = project.genres.join(', ');

        return (
            <StaticReveal id={project.id} className='writing-project-node' list={false}
            onClick={(e) => onClick(e, project.title, project.id)}>
                <motion.div className='writing-project-node-background' onClick={(e) => onClick(e, project.title, project.id)}>
                    <motion.img src={`assets/img/writing/${project.imageURL}`} className='writing-project-image'/>
                    <motion.div className='writing-project-overlay'/>
                </motion.div>
                <motion.div className='writing-project-node-info' onClick={(e) => onClick(e, project.title, project.id)}>
                    <motion.h1 className='writing-project-node-title'>{project.title}</motion.h1>
                    <motion.h2 className='writing-project-node-genres'>{genreString}</motion.h2>
                </motion.div>
            </StaticReveal>
        )
    });

    return (
        <StaticReveal id='writing-projects' list={true}>
            {projectNodes}
        </StaticReveal>
    );
}

const WritingOverlay = ({open, onClick, project}) => {
    // Create an internal function for opening the writing in another page 
    const openWriting = (e) => {
        window.open(`assets/writing/${project.src}`, '_blank');
    }

    // Check if the overlay is open
    if(open) {
        // Return a component if so
        return (
            <Fade id='writing-overlay' visibleOpacity={0.95} animationDuration={0.5}>
                <motion.div className='overlay-exit-button'
                    onClick={(e) => onClick(e, null, null)}>
                    <FontAwesomeIcon icon={faX} className='overlay-exit-icon'/>
                </motion.div>
                <motion.div className='writing-project-overlay-info'>
                    <motion.h1 className='writing-project-overlay-title'>
                        {project.title}
                    </motion.h1>
                    <motion.h2 className='writing-project-overlay-type'>
                        {project.type}
                    </motion.h2>
                    <motion.div className='writing-project-overlay-image'>
                        <motion.div className='writing-project-image-details'>
                            <motion.img src={`assets/img/writing/${project.imageURL}`} alt={project.title}/>
                            <motion.p className='writing-project-overlay-image-attribution'>{project.imageAttribution}</motion.p>
                        </motion.div>
                    </motion.div>
                    <motion.h2 className='writing-project-overlay-genres'>
                        {project.genres.join(', ')}
                    </motion.h2>
                    <motion.div className='writing-project-overlay-about'>
                        {project.about.map((text, index) => (
                            <motion.span key={index}>
                                {text}
                                {index < project.about.length - 1 && (<><br /> <br /></>)}
                            </motion.span>
                        ))}    
                    </motion.div>
                    <motion.div className='writing-project-overlay-src' onClick={(e) => openWriting(e)}>
                        <motion.h1 className='writing-project-overlay-src-content'>READ</motion.h1>
                    </motion.div>
                </motion.div>
            </Fade>
        )
    } else {
        return;
    }
}

const WritingProjects = () => {
    const [open, setOpen] = useState(false);
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentID, setCurrentID] = useState(0);
    const [project, setProject] = useState({});

    useEffect(() => {
        const loadProjectFromServer = async () => {
            const response = await fetch(`/getWritingProject?title=${currentTitle}&id=${currentID}`);
            const data = await response.json();
            setProject(data.project);
        }

        if(currentTitle == null || !currentID == null) return;

        loadProjectFromServer();

        console.log(project);
    }, [open]);

    const toggleOverlay = (e, projectTitle, projectID) => {
        setOpen(!open);
        setCurrentTitle(projectTitle);
        setCurrentID(projectID);
    };

    return (
        <>
        <WritingProjectsList onClick={toggleOverlay} />
        <WritingOverlay open={open} onClick={toggleOverlay} project={project}/>
        </>
    )
}



const Content = () => {
    return (
    <motion.div>
        <About/>
        <Projects/>
    </motion.div>
    );
}

const init = () => 
{
    const root = createRoot(document.getElementById('content'));

    root.render(<Content/>);
};

window.onload = init;

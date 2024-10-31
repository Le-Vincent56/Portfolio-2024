const React = require('react');
const { createRoot } = require('react-dom/client');
const { useState, useEffect, useRef } = React;
const { motion, AnimatePresence } = require('framer-motion');
const { FontAwesomeIcon } = require('@fortawesome/react-fontawesome');
const { faArrowLeft, faCaretDown } = require('@fortawesome/free-solid-svg-icons');
const backendHelper = require('./backendHelper.js');
const uiHelper = require('./uiHelper.js');

const Content = () => {
    const [project, setProject] = useState({});
    
    useEffect(() => {
        const loadProjectFromServer = async () => {
            const response = await fetch(`/getCodeProject?id=${document.getElementById('content').className}`);
            const data = await response.json();
            setProject(data.project);
        };
        loadProjectFromServer();
    }, []);

    if(Object.keys(project).length === 0) {
        return (
            <motion.div/>
        )
    }

    return (
        <motion.div>
            <motion.div className='header'>
                <motion.div className='back-btn' onClick={() => backendHelper.sendGet('/getHome')}>
                    <FontAwesomeIcon icon={faArrowLeft} className='back-icon'/>
                </motion.div>
                <motion.div className='header-title'>
                    <motion.h1>{project.title.toUpperCase()}</motion.h1>
                    <motion.h3>{project.genre.toUpperCase()}</motion.h3>
                </motion.div>
            </motion.div>
            <motion.div className='project-image'>
                <motion.div className='project-image-details'>
                    <motion.img src={`assets/img/code/${project.imageURL}`} alt={project.title}/>
                    <motion.p className='image-attribution'><em>Good Luck Valley</em> Cover Art by Bella Frohlich</motion.p>
                </motion.div>
            </motion.div>
            <ProjectDetails project={project}/>
            { project.downloadURL && 
                <motion.div className='project-download'
                onClick={() => window.open(`${project.downloadURL}`)}
                >
                    <motion.div className='project-download-content'>
                        <motion.h1>Download</motion.h1>
                    </motion.div>
                </motion.div>
            }
        </motion.div>
    );
}

const ProjectDetails = (props) => {
    const [expandedSection, setExpandedSection] = useState(null);
    const sectionRefs = useRef({});

    const toggleExpanded = (sectionKey) => {
        setExpandedSection((prevSection) => {
            const isCollapsing = prevSection === sectionKey;
            if(!isCollapsing) {
                setTimeout(() => {
                    sectionRefs.current[sectionKey]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 200);
            }

            return isCollapsing ? null : sectionKey;
        });
    }

    const projectNodes = Object.entries(props.project.sections).map(([key, value]) => {
        // Determine the type of value and process accordingly
        let content;

        // Check if an array
        if(Array.isArray(value)) {
            // Map the data as bullet points
            const arrayDetails = value.map(data => {
                return (
                    <motion.li>{data}</motion.li>
                )
            })

            // Create an unordered list
            content = <motion.div className='array-item'>
                          <motion.ul>{arrayDetails}</motion.ul>
                      </motion.div>
        } 
        // Check for Objects
        else if(typeof value === 'object' && value !== null) {
            // Map the object into subsections
            content = Object.entries(value).map(([subKey, subValue], index) => {
                // Check if the key represents an image (starts with "Image")
                if (subKey.startsWith("Image") && typeof subValue === 'object' && subValue.src && subValue.label) {
                    return (
                        <motion.div className='project-subsection-image'>
                            <motion.div className='project-subsection-image-details'>
                                <motion.img src={`assets/img/code/${subValue.src}`} alt={subValue.label} />
                                <motion.p className='project-subsection-image-attribution'>{subValue.label}</motion.p>
                            </motion.div>
                        </motion.div>
                    );
                }

                let subContent;

                // Check if an array
                if(Array.isArray(subValue)) {
                    //Map each  array element to a list item
                    subContent = (
                        <motion.ul>
                            {subValue.map((item, index) => (
                                <motion.li>{item}</motion.li>
                            ))}
                        </motion.ul>
                    )
                }
                else {
                    subContent = <motion.p>{subValue}</motion.p>
                }

                return (
                    <motion.div className="node-subsection">
                        <motion.h1>{subKey}</motion.h1>
                        {subContent}
                    </motion.div>
                );
            });
        } else {
            content = <motion.div className='value'>{value}</motion.div>;
        }

        // Check if this section is expanded
        const isExpanded = expandedSection === key;

        return (
            <motion.div className='section-node' 
            onMouseMove={(e) => uiHelper.highlightSectionNode(e)}
            data-expanded={isExpanded}
            ref={(el) => (sectionRefs.current[key] = el)}
            >
                <motion.div className='section-node-header' onClick={() => toggleExpanded(key)}>
                    <motion.div className='section-node-header-border'></motion.div>
                    <motion.div className='section-node-header-content'>
                        <motion.h1>{key}</motion.h1>
                        <FontAwesomeIcon 
                        icon={faCaretDown} 
                        class='section-node-header-icon'/>
                    </motion.div>
                </motion.div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div className='section-node-content'
                        initial={{ height: 0, opacity: 0}}
                        animate={{ height: 'auto', opacity: 1}}
                        exit={{ height: 0, opacity: 0}}
                        transition={{ duration: 0.3}}
                        >
                            {content}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    }) 

    return (
        <motion.div className='project-details-wrapper'>
            <motion.div className='project-details'>
                {projectNodes}
            </motion.div>
        </motion.div>
    )
}

const init = () => 
{
    const root = createRoot(document.getElementById('content'));

    root.render(<Content/>);
};

window.onload = init;
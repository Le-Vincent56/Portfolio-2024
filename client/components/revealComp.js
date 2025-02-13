// Imports
const React = require('react');
const { useEffect, useRef } = React;
const { motion, useInView, useAnimation } = require('framer-motion');

const getStaticVariant = (list, visibleOpacity) => {
    if(list) {
        return {
            hidden: { opacity: 0}, 
            visible: { opacity: visibleOpacity, transition: {
                staggerChildren: 0.2
            }}
        }
    } else {
        return {
            hidden: { opacity: 0 }, 
            visible: { opacity: visibleOpacity }
        }
    }
}

const getHorizontalVariants = (direction) => ({
    hidden: { opacity: 0, x: direction === 'left' ? -100 : 100 }, // Choose direction based on prop
    visible: { opacity: 1, x: 0 },
});

const getVerticalVariants = (direction) => ({
    hidden: { opacity: 0, y: direction === 'down' ? -100 : 100 }, // Choose direction based on prop
    visible: { opacity: 1, y: 0 },
});

const HorizontalReveal = ({id, children, direction, delay = 0}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 1 });
    const mainControls = useAnimation();

    useEffect(() => {
        if(isInView) {
            // Fire the animation
            mainControls.start('visible');
        }
    }, [isInView]);

    return (
        <motion.div ref={ref} id={id}
        variants={getHorizontalVariants(direction)}
        initial='hidden'
        animate='visible'
        transition={{
            opacity: { duration: 2.5, ease: 'easeInOut', delay },
            x: { duration: 1.5, delay, ease: 'easeOut' },
        }}
        >
            {children}
        </motion.div>
    )
}

const VerticalReveal = ({ id, children, direction, delay = 0}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.5});
    const mainControls = useAnimation();

    useEffect(() => {
        if(isInView) {
            // Fire the animation
            mainControls.start('visible');
        }
    }, [isInView]);

    return (
        <motion.div ref={ref} id={id}
        variants={getVerticalVariants(direction)}
        initial='hidden'
        animate='visible'
        transition={{ 
            opacity: { duration: 2.5, ease: 'easeInOut', delay },
            y: { duration: 1.5, delay, ease: 'easeOut' },
        }}
        >
            {children}
        </motion.div>
    )
};

const StaticReveal = ({ id, children, list, className = '', visibleOpacity = 1, animationDuration = 1.5 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();

    useEffect(() => {
        if(isInView) {
            // Fire the animation
            mainControls.start('visible');
        }
    }, [isInView]);

    return (
        <motion.div ref={ref} id={id} className={className}
        variants={getStaticVariant(list, visibleOpacity)}
        initial='hidden'
        animate='visible'
        transition={{ 
            opacity: { duration: animationDuration, ease: 'easeInOut' },
        }}
        >
            {children}
        </motion.div>
    )
};

const Fade = ({ id, children, className = '', visibleOpacity = 1, animationDuration = 1.5}) => {
    return (
        <motion.div id={id} className={className}
        initial={{opacity: 0}}
        animate={{opacity: visibleOpacity}}
        exit={{opacity: 0}}
        transition={{ 
            opacity: { duration: animationDuration, ease: 'easeInOut' },
        }}
        >
            {children}
        </motion.div>
    )
}

module.exports = {
    HorizontalReveal,
    VerticalReveal,
    StaticReveal,
    Fade
};
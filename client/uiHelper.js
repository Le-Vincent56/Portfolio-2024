const highlightSectionNode = (e) => {
    for(const node of document.getElementsByClassName('section-node')) {
        const rect = node.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

        node.style.setProperty("--mouse-x", `${x}px`);
        node.style.setProperty("--mouse-y", `${y}px`);
    }
}

module.exports = {
    highlightSectionNode
}
const hostIndex = (req, res) => {
    res.render('index', {
        title: 'HOME'
    });
}

const getHome = async (req, res) => {
    try {
        return res.status(200).json({ redirect: `/`});
    } catch (err) {
        return res.status(500).json({ error: 'Page not found '});
    }
}
    
const notFound = (req, res) => {
    res.status(404).render('notFound', {
        title: 'NOT FOUND'
    });
}

module.exports = 
{
    index: hostIndex,
    getHome,
    notFound
}
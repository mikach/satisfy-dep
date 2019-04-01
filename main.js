const React = require('react');
const { render } = require('ink');
const { useState, useEffect } = React;
const fs = require('fs');
const path = require('path');
const minimatch = require('minimatch');
const Dependency = require('import-jsx')('./Dependency');

const App = function({ match }) {
    const [dirs, setDirs] = useState([]);

    useEffect(function() {
        const dirs = fs.readdirSync(path.join(__dirname, 'node_modules')).filter(function(dirName) {
            return minimatch(dirName, match);
        });

        setDirs(dirs);
    }, []);

    return dirs.map(function(dirname, index) {
        return <Dependency name={dirname} key={index} />;
    });
};

module.exports.render = function(match) {
    render(<App match={match} />);
};

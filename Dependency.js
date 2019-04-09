const React = require('react');
const { useState, useEffect } = require('react');
const { Box, Text } = require('ink');
const Spinner = require('ink-spinner').default;

const queue = require('./queue').get();

const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

function installDeps(packageName, setStatus) {
    setStatus('Installing dependencies');

    return execPromise(
        'npm install',
        {
            cwd: path.join(process.cwd(), 'node_modules', packageName)
        }
    ).then(
        function() {
            setStatus('Installed');
        },
        function() {
            setStatus('Error');
        }
    );
}

function runTests(packageName, setStatus) {
    setStatus('Running tests');

    return execPromise('npm test', {
        cwd: path.join(process.cwd(), 'node_modules', packageName)
    }).then(
        function() {
            setStatus('OK');
        },
        function() {
            setStatus('FAIL');
        }
    );
}

const Dependency = function({ name }) {
    const [status, setStatus] = useState('Pending');

    useEffect(function() {
        queue.add(function() {
            return installDeps(name, setStatus).then(function() {
                return runTests(name, setStatus);
            });
        });
    }, []);

    return (
        <Box flexDirection="row">
            <Box width={50}>
                <Text>{name}</Text>
            </Box>
            <Box>
                {status === 'Pending' && <Spinner type="dots" />}
                {status === 'Installing dependencies' && (
                    <Spinner type="monkey" />
                )}
                {status === 'Running tests' && <Spinner type="runner" />}
                <Text>{status}</Text>
            </Box>
        </Box>
    );
};

module.exports = Dependency;

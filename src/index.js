import fs from 'fs';
import through2 from 'through2';
import Promise from 'promise';
import QunitHarness from 'qunit-harness';


var readFile = Promise.denodeify(fs.readFile);

function hang () {
    return new Promise(function () {
        // NOTE: hang forever
    });
}

export default function (qunitSettings, saucelabsSettings) {
    qunitSettings = {
        basePath:        qunitSettings.basePath || '',
        port:            qunitSettings.port,
        crossDomainPort: qunitSettings.crossDomainPort,
        scripts:         qunitSettings.scripts || [],
        css:             qunitSettings.css || [],
        configApp:       qunitSettings.configApp || null
    };

    var tests        = [];
    var qunitHarness = new QunitHarness();

    async function runTests () {
        qunitHarness
            .fixtures(qunitSettings.basePath)
            .scripts(qunitSettings.scripts)
            .css(qunitSettings.css)
            .tests(tests);

        if (typeof qunitSettings.port === 'number')
            qunitHarness.port(qunitSettings.port);

        if (typeof qunitSettings.crossDomainPort === 'number')
            qunitHarness.crossDomainPort(qunitSettings.crossDomainPort);

        if (typeof qunitSettings.configApp === 'function')
            qunitHarness.configApp(qunitSettings.configApp);

        qunitHarness.create();

        if (saucelabsSettings) {
            qunitHarness.saucelabs(saucelabsSettings);
            return await qunitHarness.run();
        }

        await hang();
    }

    return through2.obj(function (file, enc, done) {
        tests.push(file.path);
        done();
    }, async function (done) {
        var error = null;

        try {
            await runTests();
        }
        catch (err) {
            error = err;
        }
        finally {
            qunitHarness.close();
            done(error);
        }
    });
};

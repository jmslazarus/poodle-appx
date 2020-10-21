const fs = require('fs');
const mysql = require('mysql');
const deasync = require('deasync');
const { ArgumentParser } = require('argparse');


const parser = new ArgumentParser({
  description: 'evaluate mysql commands'
});

parser.add_argument('-c', '--conf', { help: 'mysql config file', required: true });
parser.add_argument('-f', '--filepath', { help: 'mysql command(s) filepath' });
parser.add_argument('-e', '--execute', { help: 'execute mysql command line' });

args = parser.parse_args();


let commands = []
if (args.filepath == undefined && args.execute == undefined) {

    console.error("ERROR: either filepath or execute is required !")
    process.exit(1)

} else if (args.filepath != undefined && args.execute != undefined ) {

    console.error("ERROR: cannot have both filepath and execute at the same time !")
    process.exit(1)

} else if (args.filepath != undefined) {

    if (!fs.existsSync(args.filepath)) {
        console.error("ERROR: path file does not exist [" + args.filepath + "] !")
        process.exit(1)
    } else {
        let content = fs.readFileSync(args.filepath, 'utf8')
        commands = content.toString().split(/;\s*\n/);
    }

} else if (args.execute != undefined) {

    commands.push(args.execute)

} else {

    console.error("ERROR: THIS SHOULD NEVER HAPPEN !")
    process.exit(1)
}


if (!fs.existsSync(args.conf)) {
    console.error("ERROR: mysql config file do not exist [" + args.conf + "] !")
    process.exit(1)
}

let mysql_conf = JSON.parse(fs.readFileSync(args.conf, 'utf8'))

let conn = mysql.createConnection({
    host: mysql_conf.host,
    port: mysql_conf.port,
    user: mysql_conf.user,
    password: mysql_conf.pass
})

// get synchronous method
let query_sync = deasync(conn.query)

commands.forEach((command) => {

    try {

        // skip empty command
        if (command.trim() == "") {
            return
        }

        let results = conn.query(command, [], (err, res, f) => {
            if (err) throw err
            console.log(`INFO: success! [${command}]`);
            //console.log(results);
        })

        //let results = query_sync(command, [])
        //console.log(`INFO: success! [${command}]`);

    } catch (error) {

        if (error) {
            console.log(`ERROR: [${command}]` + (error.length > 255 ? error.substring(0,255) : error));
            process.exit(1);
        }
    }
});

conn.end();

import fs from 'fs';
import csv from 'fast-csv';
import { events } from '../resources';
import EventEmitter from 'events';
import InputValidator from './InputValidator';

export default class StreamProvider extends EventEmitter {
  constructor(){
    super();
    this.initialized = false;
  }
  initialize(inputFile, outputFile){
    let that = this;
    return new Promise((resolve, reject) => {
      fs.open(inputFile,'r', (ierr, id)=>{
        if(ierr){
          return reject(ierr);
        }

        const inputStream = fs.createReadStream(
          null,
          {
            fd: id,
            flags: 'r',
            encoding: null,
            mode: 0o666,
            autoClose: true
          });

        that.csvIn = csv.fromStream(inputStream, {headers: true, trim: true})
          .validate(InputValidator.validate)
          .on('data-invalid', data => that.emit( events.invalidRow, data));

        fs.open(outputFile, 'w', (oerr, od) => {
          if(oerr){
            return reject(oerr);
          }

          const outputStream = fs.createWriteStream(
            null,
            {
              fd: od,
              flags: 'w',
              defaultEncoding: 'utf8',
              mode: 0o666,
              autoClose: true
            });

          that.csvOut = csv.createWriteStream({headers: true, trim: true});
          that.csvOut.pipe(outputStream);
          that.csvIn.pipe(that.csvOut);
          this.initialized = true;
          return resolve(that);
        });
      });
    });
  }
}

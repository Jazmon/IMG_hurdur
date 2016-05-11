import bcrypt from 'bcryptjs';
import Q from 'q';
import config from './config';

const db = {};

const localRegister = (username, password) => {
  const deferred = Q.defer();
  const hash = bcrypt.HashSync(password, 8);
  const user = {
    username,
    password: hash,
    avatar: 'http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG'
  };

  db.get('local-users', username)
    .then((result) => {
      console.log('username already exists');
      deferred.resolve(false);
    })
    .fail((result) => {
      console.log(result.body);
      if (result.body.message == 'The requested items could not be found.') {
        console.log('Username is free for use');
        db.put('local-users', username, user)
          .then(() => {
            console.log(`USER: ${user}`);
            deferred.resolve(user);
          })
          .fail((err) => {
            console.log(`PUT FAIL: ${err.body}`);
          });
      } else {
        deferred.reject(new Error(result.body));
      }
    });

  return deferred.promise;
};

const localAuthentication = (username, password) => {
  const deferred = Q.defer();

  db.get('local-users', username)
    .then((result) => {
      console.log('FOUND USER');
      const hash = result.body.password;
      console.log(hash);
      console.log(bcrypt.compareSync(password, hash));
      if (bcrypt.compareSync(password, hash)) {
        deferred.resolve(result.body);
      } else {
        console.log('PASSWORDS NOT MATCH');
        deferred.resolve(false);
      }
    })
    .fail((err) => {
      if (err.body.message == 'The requested items could not be found.') {
        console.log('COULD NOT FIND USER IN DB FOR SIGNIN');
        deferred.resolve(false);
      } else {
        deferred.reject(new Error(err));
      }
    });

  return deferred.promise;
}

export default {
  localRegister,
  localAuthentication
};

const shortid = require('shortid');
const mv = require('mv');
const del = require('del');
const ObjectId = require('mongodb').ObjectId;

const isFilenameImage = filename =>
  filename.match(/([a-zA-Z0-9\.\-\_]{1,20})(\.)(png|jp(e)?g|gif)$/);

const uniquefyImageFilename = filename => {
  const extension = filename.split(/(png|jp(e)?g|gif)$/)[1];
  return `${filename.substr(0, filename.length  - 1 - extension.length)}` +
    `_${shortid.generate()}.${extension}`;
};

const moveFile = (sourcepath, destination, options, callback) => {
  mv(sourcepath, destination, { mkdirp: options.mkdirp }, (err) => {
    callback(err);
  });
};

// https://stackoverflow.com/a/32170615
const makeOIdQuery = (id) => {
  const o_id = new ObjectId(id);
  return {
    _id: o_id
  };
};

const deleteRequestFiles = (req) => {
  del([req.files.file.path])
    .then(paths => {
      /* eslint-disable no-console */
      console.log('Deleted files and folders:\n',
        paths.join('\n'));
      /* eslint-enable no-console */
    });
  delete req.files;
  req.files = null;
};

module.exports = {
  isFilenameImage,
  uniquefyImageFilename,
  moveFile,
  deleteRequestFiles,
  makeOIdQuery,
};

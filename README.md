# Uniandes classroom utilities

## Context

This repository contains two scripts to convert Uniandes' [course offer](https://registroapps.uniandes.edu.co/oferta_cursos/index.php "Uniandes' course offer") into other formats for easier data representation.  

Particularly, these scripts were made to populate the [Sobrecupo](https://github.com/SeCardenas/SobreCupoWebApp)'s DB. Therefore, the final format is optimized for empty-classroom searches on a specific date.  

These scripts are no longer maintained but feel free to use the files generated by them or submit pull requests to update for new course offer formats.

## Usage

In order to run the scripts, the 'data.rar' file should be decompressed and Node.js should be installed. Then, generating the files requires running the scripts in order:

```bash
node coursesToClassrooms.js
node dbGenerator.js
```

Beware as these scripts generate a big set of files and will overwrite previous generated files.

## License

MIT

Julián Manrique 2018

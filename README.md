# build-md-toc
Build a table of contents from a github wiki directory

## How it works

This tool will allow you organize your wiki md files into subdirectories, then will generate a table of contents based on your file structure. It will create a title for every directory, and then nested under each title a list of the md files in that directory. 

For example, if your file structure looks like this:

```
./Apps/Client-App/Deploying-Client-App.md
./Apps/Client-App/Client-App-Environment-Setup.md
./Utils.md
./Team/Organization.md
./Team/Engineering.md
./Team/Product.md
```

The Home.md generated will product markdown like this: 

```
- [Utils](Utils)

## Apps

- ### Client App
    - [Deploying Client App](Deploying-Client-App)
    - [Client App Environment Setup](Client-App-Environment-Setup)

## Team
- [Organization](Organization)
- [Engineering](Engineering)
- [Product](Product)

```

## Instructions

1. copy the file generateTableOfContents.js into the root of your wiki 
2. from the command line, at the root of your wiki, run `node generateTableOfContents.js`
3. The Home.md will be rewritten with the updated table of contents


## Caveats

- despite this allowing you to use directories to organize your mds, github wiki will still treat everything like a top-level file. So you'll need to make sure every file name were unique just as if they lived in their own directory
- this will completely replace your Home.md (In the future I may create some kind of template, but since this solves my immediate problem, I dunno if I will ever get around to it)
- if you add or change pages from the github website, you'll need to rerun this and push the results (or your table of contents will be out of date)

The typical use case is to use this one time to generate your TOC, then manually edit from that point forward, but it's entirely up to you how you want to use this!
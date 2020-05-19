# What is Deno and will it Replace NodeJS?

Deno v1.0.0 is scheduled for release on May 13. Here are a few interesting facts that may play a role in determining that.

![deno](https://miro.medium.com/max/1400/1*GzfZZNWFeQ3kKJsKeKy7_A.jpeg)

The short answer is (obviously) it’s way too early to tell but here are a few facts that may have a large role in determining that.

For starters, [Deno](https://deno.land/) is the creation of Ryan Dahl, also known for the creation of a little thing called Node.js, sounds familiar? Does that mean Deno is automatically a de facto replacement for Node and we should all start planning our refactoring sprints? Heck no! But if you want to know more, keep reading!

## Let’s start at the beginning

In 2018, Ryan gave a talk where he covered the top 10 things he thought were wrong with Node.js, and at the end of that presentation, he unveiled Deno, back then it was just a small project where he was building what you’d call Node.js v2, improved and more secure.

Here is the video of that presentation:

油管内容:<iframe width="665" height="382" src="https://www.youtube.com/embed/M3BM9TB-8yA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Two years later, the date’s been set: May 13th, that’s when Deno 1.0 will be officially released. A brand new JavaScript runtime for the backend, but instead of being written in C++, it’s written in Rust, based on the [Tokio](https://tokio.rs/) platform (which provides the asynchronous runtime needed by JavaScript), still running Google’s V8 engine though.

## But what else is new?

We’re not just talking about a new JavaScript runtime fully compatible with the current Node.js, instead, Ryan took the opportunity to cook some things into Deno that he considered were missing from his earlier creation.

## Security is integrated

By default, Node.js allows you to access everything, meaning, you can read and write into the filesystem, make outgoing requests, access environment variables, and so on. Although as a developer having that kind of access is a benefit, it also opens up a security risk if you’re not careful when writing your own code.

So instead, Deno uses command-line arguments to enable or disable access to different security features. So if you need your script to be able to access the /etc folder, you can do:

```ts
deno --allow-read=/etc myscript.ts
```

That would allow your code to read from the folder, anything else and you’ll get a security exception. This is similar to how other platforms handle security. If you’re an Android user, you’ve surely been asked before by many applications to allow them to access different systems inside your phone (i.e contacts, phone calls, folders, etc), the same concept can be applied here. By using these flags as part of the command line that executes your script, you’re providing the permissions required by your code.

## A more complete standard library

JavaScript has improved its standard library since the first versions of Node, but it still has quite a way to go compared to other languages. Deno also tried to improve that and claims to have a very complete standard library allowing developers to use official tools to perform basic tasks and only requiring the use of external libraries (ala NPM) for complex tasks.
Essentially, out of the box, Deno comes with the tools to add [color](https://deno.land/std/fmt/colors.ts) to terminal text, work with [external data structures](https://deno.land/std/encoding/README.md) (such as binary, csv, yaml and others), generate [UUIDs](https://deno.land/std/uuid/README.md) and even write [websockets](https://deno.land/std/ws/README.md). There are other, more basic modules available as well, such as file system access, date helper functions, http-related functions and [more](https://deno.land/std/).

## Integrated Typescript

You read that right, if you’re a fan of TypeScript, then Deno’s got you covered, no need for external tooling, by default the transpilation into JavaScript is done internally, so no need to worry about that.

Although by default Deno takes care of a lot, you can overwrite the configuration by using your own tsconfig.json file:

```ts
deno run -c tsconfig.json [your-script.ts]
```

The default configuration is to use strict mode, so any ill-adviced coding practice will be alerted immidiately.

## No more NPM or node_modules folder

This one’s a big since everyone and their mother has had something to say about it in the past. Is it too bloated? Is it the wrong way to distribute dependencies? It is definitely one of the most controversial aspects of Node and Deno decided to get rid of it, altogether.

So how is Deno handling dependencies? So far, by simply allowing you to require modules from anywhere. In other words, you can simply do:

```ts
import * as log from "https://deno.land/std/log/mod.ts";
```

No need to have your own centralized repository anymore, but you do have to be careful with this practice, since importing modules from 3rd party sources you don’t have control over, leaves you open and exposed.

In fact, our good pal package.json is also missing, dependency management is now simplified by having a list of modules and their respective URLs on a file called deps.ts . But what about versioning? I hear you ask. Well, you can specify the package version on the URL, it’s not really elegant, but it works.

A normal deps.ts file could look like this:

```ts
export { assert } from "https://deno.land/std@v0.39.0/testing/asserts.ts";
export { green, bold } from "https://deno.land/std@v0.39.0/fmt/colors.ts";
```

That will re-export modules and if you wanted to change their version, simplify modify the URL accordingly.

The imported code is cached, by the way, the first time you execute the script and until you run it again with the --reload flag.

## What else?

There are other features included by Deno, such as bigger tooling out of the box with things such as a test runner, debugger, file watcher, and others. But then again, some of these are just APIs provided by the language, and you need to code your own tools in order to use them.

Take the example of the file watcher API, provided to you by Deno.watchFs , if you’re looking for a similar solution to nodemon then you have to build it yourself. Here is what a 23 lines script that solves a similar problem looks like:

![code](https://miro.medium.com/max/1400/1*VI1E-bhnnp3bvjH7d3cMiA.png)

The user Caesar2011 published it as part of one of his repos, you can find the full code [over here](https://github.com/Caesar2011/rhinoder/blob/master/mod.ts).

## So, will it replace Node.js anytime soon?

Not really, to be honest, the title is a bit of a clickbait. Some of us started using Node.js back in the day when it was around version 0.10, and we were using it in production! It was a bit scary to tell you the truth, but we were doing it because there was nothing like it around. Neither PHP, Python or even Ruby (let alone Java or .NET) could compare to having JavaScript and an asynchronous I/O model in the back-end, all in one. And over all these years, Node (and JavaScript) has evolved to meet the industry’s requirements. Is it perfect? Heck no! But like anything else in life, there is no perfect when it comes to programming languages.

Deno is no different, simply because right now, it’s just the culmination of around 2 years of work on an idea. It hasn’t been tried and tested in production systems yet. It hasn’t been reviewed and put into weird and unintended use cases to see how it deals with those border situations. And until it does, it’ll just be a toy for early adopters to play with. Maybe in a year, we’ll start hearing from companies sharing their experiences with it, how they’ve solved the newly found shortcomings, and eventually, the community behind it will adapt it to a point where it is useful. Will it replace Node then? Who knows! We’ll have to wait and see.

So, what do you think?

[原文地址:](https://blog.bitsrc.io/what-is-deno-and-will-it-replace-nodejs-a13aa1734a74)
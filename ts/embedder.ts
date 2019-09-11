import config from './config';

// creates an embed for a single project, with a page of issues
// includes project title, description, lead, and 5 project issues from page <n> 
// <n> is determined by user input
function createSingleProject(issueData, projectData, totalProjects) {
    let countIndex = 0;

   let embedJSON = {
        "embed" : {
            "title" : `Last ${issueData.length} open issues:`,
            "description": "Note that the issue number is actually their ID, and issue numbers are not necessarily sequential.",
            "color" : config.embedColor,
            "thumbnail": {
              "url": "https://cdn.discordapp.com/embed/avatars/0.png"
            },
            "author" : {
                "name" : projectData.name,
                "url" : config.standardURL + projectData.shortname,
            },
            "fields" : []
        }
    }

    if (issueData.length==0) return embedJSON
    
   for (let key in issueData) {
        if (issueData.hasOwnProperty(key)) {
            embedJSON.embed.fields.push(
                {
                  "name": `Issue ${issueData[key].iid}: ${issueData[key].title}`,
                    "value" : (issueData[key].description== "" || issueData[key].description == undefined) ? "..." : issueData[key].description
                }
            )
        }
      //   countIndex++;
      //   console.log(countIndex)
      // count = issueData[countIndex].iid
    }

    return embedJSON
}

// creates a single issue embed from all data for all issues from a project
// uses the helper createSingleIssueFromOneData (which only takes in data for one issue, not for all issues)
// includes, title, description, and a link
// if existing, also includes the issue's creation/updated date, creator, due date, assignee, closed 

// @param allData all data for all issues from a project
// @param projectName the name of the project
// @param issueNumber the id of the issue to be created
function createSingleIssueFromAllData(allData, projectName : string, issueNumber : number) {
    var data
    for (let i=0;i<allData.length;i++) {
        if (allData[i].iid==issueNumber) data = allData[i]
    }

    // if the given issue ID is invalid
    if (data==undefined) {
        return {
            "embed": {
                "color" : config.embedColor,
                "title" : "Sorry, there is no issue with ID "+issueNumber
            }
        }
    }

    return createSingleIssueFromOneData(data, projectName, issueNumber);
}

// creates a single issue embed from only the data for one issue
function createSingleIssueFromOneData(data, projectName : string, issueNumber : number) {
    var embedJSON = {
        "embed": {
            "title" : data.title,
            "description" : data.description,
            "url" : data.web_url,
            "color" : config.embedColor,
            "footer": {
                "icon_url" : data.author.avatar_url,
                "text" : "Opened by " + data.author.name
            },
            "author" : {
                "name" : projectName + " Issue #" + issueNumber
            },
            "fields" : []
        }
    }
    
    const state = data.state;

    if (state=="opened") {
        var fieldName = "opened";
        if (data.created_at!=data.updated_at) fieldName = "updated";

        embedJSON.embed.fields.push({ 
            "name" : fieldName,
            "value" : parseDate(data.updated_at)
        })

        if (data.due_date!=null) {
            embedJSON.embed.fields.push({
                "name" : "due at",
                "value" : data.due_date
            })
        }

        const assignees = data.assignees;
        if (assignees.length!=0) {
            var assigneeList = assignees[0].name;
            for(var i=1;i<assignees.length;i++)
                assigneeList += ", "+assignees[i].name

            embedJSON.embed.fields.push({
                "name" : "assigned to",
                "value" : assigneeList
            })
        }

    } else if (state=="closed") {
        embedJSON.embed.fields.push( 
            { 
            "name" : "closed at",
            "value" : parseDate(data.closed_at)
        }, {
            "name" : "closed by",
            "value" : data.closed_by.name
        })

    }
    return embedJSON
}

// creates a help function for describing each function
function createHelp() {
    return {
        "embed": {
          "description": "Warden lets you get issue stuff in the channel. Note: has to be in the channel corresponding to the project for specific project stuff to work",
          "color": config.embedColor,
          "author": {
            "name": "WardenBot"
          },
          "fields": [
            {
              "name": "help",
              "value": "'@Warden help' to get help."
            },
            {
              "name": "describe",
              "value": "'@Warden describe all projects' to describe all current projects. \n'@Warden describe issues, page 3' to describe page 3 of the project's issues (5 issues per page, starting from the most recent ones) (do this in the project's channel).\n'@Warden describe issue 3' to describe the issue with id 3 of the project. "
            },
            {
              "name": "createissue",
              "value": "'@Warden createissue \"title: SomeTitle\" \"description: SomeDescription\" \"assignee: @someone\"' to create an issue in the project. The title field is mandatory."
            },
            {
              "name": "close issue",
              "value": "'@Warden close issue 3' to close issue with id 3"
            }
            // {
            //   "name": "assignissue",
            //   "value": "'@Warden' assignissue 3 to @someone' to assign or reassign issue 3 to someone."
            // }
          ]
        }
      }
}

// parses the date string into a more readable format
// not implemented yet
function parseDate(date : string) {
    return date;
}

export {createSingleProject, createSingleIssueFromAllData, createSingleIssueFromOneData, createHelp}
const { ipcRenderer } = require('electron')
const DataStore = require('../DataStore')
const projectsData = new DataStore({ name: 'projects' })
const { PythonShell } = require('python-shell')

const options = {
    args:[JSON.stringify({"uid":"XZsGi9A93NNH4fRYYI5a2Wk4Hfm1","lat":"37.5916983","lng":"127.01206040000001"})]
}

PythonShell.run('proprietary/gorilaml.py', options, function(err, results) {
    if(err) throw err
    //console.log('results', results)
})

const createBtn = {
    view:"button", 
    value:"Create", 
    css:"webix_primary", 
    click: () => {
        const formData = $$("frmCreateProject").getValues()
        const addrecord = {id: new Date().getTime(), name: formData.name, published:'no', created:'today'}
        projectsData.addProject(addrecord)
        $$("myprojects").add(addrecord)
        
        if ($$("myprojects").count())
        $$("myprojects").hideOverlay()
    }
}

const updateBtn = {
    view:"button", 
    value:"Update", 
    css:"webix_secondary", 
    click: () => {
        const formData = $$("frmCreateProject").getValues()
        const updaterecord = {id: formData.id, name: formData.name, published:'no', created:'today'}
        projectsData.updateProject(updaterecord)
        $$("myprojects").updateItem(updaterecord)
    }
}

const form = {
    id:"frmCreateProject",
    view:"form",
    width:300,
    elements:[
        { view:"text", name:"name", placeholder:"Enter Project Name", align:"center" },
        { cols:[createBtn, updateBtn] }
    ]
}

const datatable = {
    id:"myprojects",
    view:"datatable",
    select:"row",
    scrollX:false,
    columns:[
        { id:'name', header:"Project Name", fillspace:true},
        { id:'published', header:"Published" },
        { id:'created', header:"Created" },
        { id:'view', header:"", template:"<span class='webix_icon wxi-eye'></span>", width:40},
        { id:'trash', header:"", template:"<span class='webix_icon wxi-trash'></span>", width:40}
    ],
    on:{
        onAfterLoad:function() {
            if (!this.count())
            this.showOverlay("Sorry, there is no data")
        },
        "onItemClick":function(id, e, trg) {
            if (id.column == 'trash') {
                const project = this.getItem(id)
                projectsData.deleteProject(project)
                this.remove(id.row)

                if (!this.count())
                this.showOverlay("Sorry, there is no data")
            }
            else if (id.column == 'view') {
                const project = this.getItem(id)
                webix.storage.local.put("current_project", project)
                ipcRenderer.send('experiments', project.name)
            }
        }
    }
}

const projectWebix = new webix.ui({
    id:"projectDashboard",
    container:"projectDashboard",
    cols:[form, datatable]
})

webix.ui(projectWebix).show()
$$("frmCreateProject").bind($$("myprojects"))
$$("myprojects").clearAll()
$$("myprojects").parse(projectsData.projects)
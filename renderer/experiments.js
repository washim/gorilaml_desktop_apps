const { ipcRenderer } = require('electron')
const DataStore = require('../DataStore')
const experimentsData = new DataStore({ name: 'experiments' })

const createBtn = {
    view:"button", 
    value:"Create", 
    css:"webix_primary", 
    click: () => {
        const formData = $$("frmCreateExperiment").getValues()
        const addrecord = {id: new Date().getTime(), pid: formData.pid, name: formData.name, comment: formData.comment, rules:""}
        experimentsData.addExperiment(addrecord)
        $$("myexperiments").add(addrecord)
        $$("frmCreateExperiment").setValues({name:"",comment:"",rules:""})

        if ($$("myexperiments").count())
        $$("myexperiments").hideOverlay()
    }
}

const updateBtn = {
    view:"button", 
    value:"Update", 
    css:"webix_secondary", 
    click: () => {
        const formData = $$("frmCreateExperiment").getValues()
        const updaterecord = {id: formData.id, pid: formData.pid ,name: formData.name, comment: formData.comment, rules: formData.comment}
        experimentsData.updateExperiment(updaterecord)
        $$("myexperiments").updateItem(updaterecord)
    }
}

const form = {
    id:"frmCreateExperiment",
    view:"form",
    width:300,
    elements:[
        {
            view:"text",
            name:"name",
            placeholder:"Enter experiment name", 
            align:"center"
        },
        {
            view:"text",
            name:"comment",
            placeholder:"Enter comments for experiment", 
            align:"center"
        },
        {
            cols:[createBtn, updateBtn]
        }
    ]
}

const datatable = {
    id:"myexperiments",
    view:"datatable",
    select:"row",
    scrollX:false,
    height:600,
    columns:[
        { id:'name', header:"Experiments", fillspace:true},
        { id:'comment', header:"Comments", width:200 },
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
                const experiment = this.getItem(id)
                experimentsData.deleteExperiment(experiment)
                this.remove(id.row)

                if (!this.count())
                this.showOverlay("Sorry, there is no data")
            }
            else if (id.column == 'view') {
                const experiment = this.getItem(id)
                webix.storage.local.put("current_experiment", experiment)
                ipcRenderer.send('rules', experiment.name)
            }
        }
    }
}

const experimentsWebix = new webix.ui({
    id:"experimentsDashboard",
    container:"experimentsDashboard",
    cols:[form, datatable]
})

webix.ui(experimentsWebix).show()
$$("frmCreateExperiment").bind($$("myexperiments"))
$$("frmCreateExperiment").setValues({ pid:webix.storage.local.get("current_project").id }, true)
$$("myexperiments").parse(experimentsData.experiments.filter(t => t.pid === webix.storage.local.get("current_project").id))
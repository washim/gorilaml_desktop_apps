$(document).ready(function() {
    const DataStore = require('../DataStore')
    const experimentsData = new DataStore({ name: 'experiments' })

    const rules_frm_db_select = {
        id:"frmRulesDbSelect",
        view:"form",
        elements:[
            {
                view: "text",
                placeholder: "Enter valid rule name",
                label: "Rule name",
                name:"name"
            },
            {
                options: [
                    "CSV",
                    "TSV",
                    "JSON"
                ],
                view: "combo",
                placeholder: "Choose file format",
                label: "Type",
                name:"type"
            },
            {
                view: "text",
                placeholder: "Enter file path",
                label: "File Path",
                name:"path"
            },
            {
                cols:[
                    {
                        view:"button", 
                        value:"Create", 
                        css:"webix_primary", 
                        click: () => {
                            const formData = $$("frmRulesDbSelect").getValues()
                            const operatorData = {
                                top: 60,
                                left: 100,
                                properties: {
                                    id: formData.id,
                                    title: formData.name,
                                    name: formData.name,
                                    pid: formData.pid, 
                                    cid: formData.cid,
                                    type: formData.type, 
                                    path: formData.path,
                                    inputs: {
                                        input_1: {
                                            label: 'Input 1',
                                        }
                                    },
                                    outputs: {
                                        output_1: {
                                            label: 'Output 1',
                                        }
                                    }
                                }
                            }
                            addMyGround(formData.id, webix.storage.local.get("current_experiment").id, operatorData)
                        }
                    },
                    {
                        view:"button", 
                        value:"Update", 
                        css:"webix_secondary", 
                        click: () => {
                            const formData = $$("frmRulesDbSelect").getValues()
                            const DrulesData = JSON.parse(experimentsData.experiments.filter(t => t.id === webix.storage.local.get("current_experiment").id)[0].rules)
                            DrulesData.operators[formData.id].properties.title = formData.name
                            DrulesData.operators[formData.id].properties.name = formData.name
                            DrulesData.operators[formData.id].properties.type = formData.type
                            DrulesData.operators[formData.id].properties.path = formData.path
                            updateMyGround(webix.storage.local.get("current_experiment").id, DrulesData)
                        }
                    }
                ]
            }
        ]
    }

    const rules_frm_view_db = {
        id:"frmRulesViewDb",
        view:"form",
        elements:[
            {
                view: "text",
                placeholder: "Enter valid rule name",
                label: "Rule name",
                name:"name"
            },
            {
                cols:[
                    {
                        view:"button", 
                        value:"Create", 
                        css:"webix_primary", 
                        click: () => {
                            console.log('ok')
                        }
                    },
                    {
                        view:"button", 
                        value:"Update", 
                        css:"webix_secondary", 
                        click: () => {
                            console.log('ok')
                        }
                    }
                ]
            }
        ]
    }

    const rules_widget = {
        rows:[
            { view:"template", template:"Choose Rule", type:"header" },
            {
                view:"list", 
                id:"widget",
                template:"#name#", 
                select:true,
                width:400,
                height:250,
                data: [
                    { id:1, name:"Select Data Source" },
                    { id:2, name:"View Data Source" },
                    { id:3, name:"Select Features" },
                    { id:4, name:"Select Target Feature" },
                    { id:5, name:"Select Regression Model" },
                    { id:6, name:"View Regression Result" }
                ],
                on: {
                    "onItemClick":function(id, e, trg) {
                        data = this.getItem(id)
                        if(id == 1) {
                            $$('frmRulesDbSelect').show()
                            $$('frmRulesDbSelect').setValues({
                                id: new Date().getTime(), 
                                name: data.name,
                                cid: data.id,
                                pid: webix.storage.local.get("current_project").id
                            })
                        }
                        else if(id == 2) {
                            $$('frmRulesViewDb').show()
                            $$('frmRulesViewDb').setValues({
                                id: new Date().getTime(), 
                                name: data.name,
                                cid: data.id,
                                pid: webix.storage.local.get("current_project").id
                            })
                        }
                    }
                }
            },
            { id:"ruleHeader", view:"template", template:"Rule Action", type:"header" },
            { id:"widgetAction", cells:[{'template':'Please select rules'}, rules_frm_db_select, rules_frm_view_db] }
        ]
    }

    const rules_drag_drop = {
        rows:[
            {
                view:"toolbar", cols:[
                    { view:"button", value:"Run", css:"webix_primary", width:100 },
                    { view:"button", value:"Delete", width:100, css:"webix_danger", click: () =>{
                        const ground = $('#dragDropArea')
                        ground.flowchart('deleteSelected')
                        const DrulesData = ground.flowchart('getData')
                        const experiment = {
                            "id": webix.storage.local.get("current_experiment").id,
                            "rules": JSON.stringify(DrulesData).toString()
                        }
                        experimentsData.updateExperimentByRule(experiment)
                    }}
                ]
            },
            {
                id:'dragDropWidget',
                height:600,
                template:'<div id="dragDropArea" style="width:590px; height:590px;"></div>'
            }
        ]
    }

    const addMyGround = (id, eid, data) => {
        const ground = $('#dragDropArea')
        ground.flowchart() //First initialization required with empty
        ground.flowchart('createOperator', id, data)
        const DrulesData = ground.flowchart('getData')
        const experiment = {
            "id": eid,
            "rules": JSON.stringify(DrulesData).toString()
        }
        experimentsData.updateExperimentByRule(experiment)
        $$("frmRulesDbSelect").setValues({name: "", type: "", path: ""})
    }

    const updateMyGround = (id, data) => {
        const ground = $('#dragDropArea')
        ground.flowchart({
            linkWidth: 2,
            grid: 0,
            distanceFromArrow: 2,
            linkVerticalDecal: 1,
            defaultLinkColor: 'black',
            defaultSelectedLinkColor: 'red'
        })
        ground.flowchart('setData', data)
        const DrulesData = ground.flowchart('getData')
        const experiment = {
            "id": id,
            "rules": JSON.stringify(DrulesData).toString()
        }
        experimentsData.updateExperimentByRule(experiment)
    }

    const rulesWebix = new webix.ui({
        id:"rulesDashboard",
        container:"rulesDashboard",
        cols:[rules_widget, rules_drag_drop]
    })

    webix.ui(rulesWebix).show()
    const myexp = experimentsData.experiments.filter(t => t.id === webix.storage.local.get("current_experiment").id)
    const ground = $('#dragDropArea')
    ground.flowchart({
        linkWidth: 2,
        grid: 0,
        distanceFromArrow: 2,
        linkVerticalDecal: 1,
        defaultLinkColor: 'black',
        defaultSelectedLinkColor: 'red',
        data: JSON.parse(myexp[0].rules),
        onOperatorSelect: function(operatorId) {
            const rdata = ground.flowchart('getOperatorData', operatorId)
            const data = rdata.properties
            if(data.cid == 1) {
                $$('frmRulesDbSelect').show()
                $$('frmRulesDbSelect').setValues({
                    id: data.id, 
                    name: data.name,
                    cid: data.cid,
                    pid: data.pid,
                    title: data.name,
                    type: data.type, 
                    path: data.path
                })
            }
            return true
        },
        onAfterChange: function (changeType) {
            const DrulesData = ground.flowchart('getData')
            const experiment = {
                "id": webix.storage.local.get("current_experiment").id,
                "rules": JSON.stringify(DrulesData).toString()
            }
            experimentsData.updateExperimentByRule(experiment)
            return true
        }
    })
})
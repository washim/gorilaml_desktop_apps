const Store = require('electron-store')

class DataStore extends Store {
    constructor(settings) {
      super(settings)
  
      this.projects = this.get('projects') || []
      this.experiments = this.get('experiments') || []
      this.rules = this.get('rules') || []
      this.filtered_data = []
    }

    saveProject() {
        this.set('projects', this.projects)

        return this
    }

    getProjects() {
        this.projects = this.get('projects') || []

        return this
    }

    addProject(project) {
        this.projects = [ ...this.projects, project ]

        return this.saveProject()
    }

    updateProject(project) {
        for (var i = 0; i < this.projects.length; i++) {
            if (this.projects[i]['id'] === project.id) {
            this.projects[i]['name'] = project.name
            }
        }

        return this.saveProject()
    }

    deleteProject(project) {
        this.projects = this.projects.filter(t => t.id !== project.id)

        return this.saveProject()
    }
  
    saveExperiment() {
        this.set('experiments', this.experiments)

        return this
    }
  
    getExperiments() {
        this.experiments = this.get('experiments') || []

        return this
    }

    getExperimentsByPid(pid) {
        this.filtered_data = this.experiments.filter(t => t.pid === pid)

        return this
    }
  
    addExperiment(experiment) {
        this.experiments = [ ...this.experiments, experiment ]

        return this.saveExperiment()
    }

    updateExperiment(experiment) {
        for (var i = 0; i < this.experiments.length; i++) {
            if (this.experiments[i]['id'] === experiment.id) {
                this.experiments[i]['name'] = experiment.name
                this.experiments[i]['comment'] = experiment.comment
            }
        }

        return this.saveExperiment()
    }

    updateExperimentByRule(experiment) {
        for (var i = 0; i < this.experiments.length; i++) {
            if (this.experiments[i]['id'] === experiment.id) {
                this.experiments[i]['rules'] = experiment.rules
            }
        }

        return this.saveExperiment()
    }
  
    deleteExperiment(experiment) {
        this.experiments = this.experiments.filter(t => t.id !== experiment.id)

        return this.saveExperiment()
    }

    saveRule() {
        this.set('rules', this.rules)

        return this
    }

    getRules() {
        this.rules = this.get('rules') || []

        return this
    }

    getRulesByPidAndEid(pid, eid) {
        this.filtered_data = this.rules.filter(t => t.pid === pid && t.eid === eid)

        return this
    }

    addRule(rule) {
        this.rules = [ ...this.rules, rule ]

        return this.saveRule()
    }

    updateRule(rule) {
        for (var i = 0; i < this.rules.length; i++) {
            if (this.rules[i]['id'] === rule.id) {
                this.rules[i]['name'] = rule.name
                this.rules[i]['type'] = rule.type
                this.rules[i]['path'] = rule.path
            }
        }

        return this.saveRule()
    }

    deleteRule(rule) {
        this.rules = this.rules.filter(t => t.id !== rule.id)

        return this.saveRule()
    }
  }
  
  module.exports = DataStore
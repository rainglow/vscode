

// line comment

/* block quote */


import { thing } from 'thing';

thing()

'Strings'; "Strings";



Proxy.prototype = Proxy.prototype || Proxy.__proto__;

export class $ extends Proxy {
  constructor (...args) {
    let _ = Object.assign({
      listeners: {},

      onPropertyChange: function (key, listener) {
        this.listeners[key] = this.listeners[key] || [];
        this.listeners[key].push(listener); 
      }
    }, ...args);

    super(_, {
      get: function (obj, prop) {
        return obj[prop];
      },

      set: function (obj, prop, value) {
        let old = obj[prop];
        if (old !== value) {
          obj[prop] = value;
          (obj.listeners[prop] || []).forEach(l => { l(value, old) });
        }
        return obj[prop];
      }
    });
  }
}

class ObservableHTMLElement extends HTMLElement {
  constructor (...args) {
    super(...args);

    // populate innerHTML
    let doc = (document._currentScript || document.currentScript).ownerDocument
    let template = doc.querySelector(`template#${this.tagName.toLowerCase()}`);
    this.createShadowRoot();
    this.shadowRoot.appendChild(document.importNode(template.content, true)); 

    // set up publish-subscribe model
    this.listeners = {};
    this.observer = new MutationObserver((changes) => {
      for (let change of changes) {
        let prop = change.attributeName;
        let newValue = change.target.getAttribute(prop);
        (this.listeners[prop] || []).forEach(l => { l(newValue) });
      }
    });
    this.observer.observe(this, { attributes: true });
  }

  onPropertyChange (attr, listener) {
    this.listeners[attr] = this.listeners[attr] || [];
    this.listeners[attr].push(listener); 
  }

  static register () {
    window.customElements.define(this.is, this);
  }
}
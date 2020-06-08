package com.kosaka;

import java.util.ArrayList;
import java.util.List;

public class MyString {
    private List<MyString> children;
    private String value;

    MyString () {
        this.children = new ArrayList<MyString>();
        this.value = "";
    }

    MyString (String value) {
        this.value = value;
    }

    public List<MyString> getChildren() {
        return children;
    }

    public void setChildren(List<MyString> children) {
        this.children = children;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}

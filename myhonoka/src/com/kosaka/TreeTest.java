package com.kosaka;

import com.sun.deploy.net.MessageHeader;

import java.util.ArrayList;
import java.util.List;

public class TreeTest {

    private static List<MyString> myStringList = new ArrayList<>();

    public static void main(String[] args) {
        init();
        // 获取子节点经过的父节点
        getString(myStringList);
    }

    public static void getString(List<MyString> stringList) {
        for (MyString myString : stringList) {
            if (myString.getValue() == "test") {
                System.out.println("结束");
                break;
            }
            System.out.println(myString.getValue());
            if (myString.getChildren() != null) {
                getString(myString.getChildren());
            }
        }
    }


    private static void init() {
        MyString parent1 = new MyString("1-1");
        MyString parent2 = new MyString("1-2");
        MyString parent3 = new MyString("1-3");
        MyString parent4 = new MyString("1-4");
        List<MyString> myStrings = new ArrayList<MyString>();
        MyString child1 = new MyString("2-1");
        MyString child2 = new MyString("2-2");
        MyString child3 = new MyString("2-3");
        int childNum = 0;
        List<MyString> childStrings = new ArrayList<MyString>();
        while (childNum < 5) {
            MyString child = new MyString("3-" + childNum);
            childStrings.add(child);
            childNum++;
        }
        child1.setChildren(childStrings);
        child2.setChildren(childStrings);
        child3.setChildren(childStrings);
        myStrings.add(child1);
        myStrings.add(child2);
        myStrings.add(child3);
        parent1.setChildren(myStrings);
        parent2.setChildren(myStrings);
        parent3.setChildren(myStrings);
        parent4.setChildren(myStrings);
        List<MyString> childStrings2 = new ArrayList<>();
        childNum = 0;
        while (childNum < 5) {
            MyString child = new MyString("4-" + childNum);
            childStrings2.add(child);
            childNum++;
        }
        childStrings2.add(new MyString("test"));
        child2.setChildren(childStrings2);
        myStringList.add(parent1);
        myStringList.add(parent2);
        myStringList.add(parent3);
        myStringList.add(parent4);
    }

}

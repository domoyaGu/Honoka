package com.honoka;

public class Main {

    public static void main(String[] args) {
	    // write your code here
        String str1 = "1";
        String str2 = new String("1");
        String str3 = new String("1");
        System.out.println(str1 == str2);
        System.out.println(str2 == str3);
        System.out.println(str1 == str3);
        System.out.println(str1.equals(str2));
        System.out.println(str2.equals(str3));
        System.out.println(str1.equals(str3));
    }
}
